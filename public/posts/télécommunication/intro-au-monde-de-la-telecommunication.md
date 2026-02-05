---
title: Introduction au monde de la télécommunication
excerpt: Cette série d'articles explorera l'architecture complexe qui permet le transfert d'informations du point A au point B.
date: 2026-02-05
author: Haytham
readTime: 10 min
tags: [Télécommunication, Théorie de l'information, Codage, Modulation, ENSEEIHT]
---

# Introduction au monde de la télécommunication

## Introduction :

La communication est fondamentalement essentielle pour les êtres humains : elle constitue le socle de la construction des relations, favorise la compréhension, aide à résoudre les problèmes et permet la collaboration dans tous les aspects de la vie, des liens personnels à la réussite professionnelle. Sans elle, les individus peinent à exprimer et partager leurs besoins, leurs émotions et leurs idées.

Pendant des milliers d'années, cette communication restait prisonnière de contraintes physiques. Pour échanger, il fallait être dans la même pièce, le même village à portée de voix. Les messages pouvaient, bien sûr, voyager, bien sûr: un message à cheval, une lettre sur un navire, des signaux de fumée entre deux collines. Mais tout ça prenait du temps, des jours, des semaines, voire des mois.

Et puis, au bout de deux siècles, tout a basculé avec l'introduction de la télécommunication.

Aujourd'hui, il est devenu banal qu'un utilisateur ouvre une application de messagerie comme WhatsApp, tape un message simple comme "*salut, tu es où ?*", appuie sur envoyer, et que son ami le reçoive presque instantanément, même à l'autre bout du monde. Ce qui semble relever de la magie quotidienne est en réalité le fruit de plus de cent ans d'ingénierie et de recherches. Un siècle d'efforts acharnés pour concrétiser ce qui était autrefois impensable, de lutte contre les imperfections environnementales, pour aboutir à une réalisation dont l'humanité peut être fière : la télécommunication.

### Comment c'est possible ?

Cette série d'articles explorera l'architecture complexe qui permet le transfert d'informations du point A au point B. Nous décortiquons chaque étape de **la chaîne de transmission** révélant ainsi les secrets de tout système de télécommunication moderne, de la source à la réception.

## La chaîne de transmission : le cœur du système

Derrière chaque message envoyé se cache un parcours complexe. Tout message envoyé subit une série de transformations soigneusement orchestrées (la compression, la protection contre les erreurs…). C'est ce qu'on appelle la chaîne de transmission.

![Figure 1 : visualisation des différentes étapes de la chaîne de transmission](/posts/t%C3%A9l%C3%A9communication/Chaine-de-transmission.png)
*Figure 1 : visualisation des différentes étapes de la chaîne de transmission*

Cette chaîne peut se diviser en trois grandes parties : l'émetteur, qui prépare l'information pour le voyage ; le canal, qui la transporte tout en lui faisant subir diverses perturbations ; et le récepteur, qui reconstitue le message original à partir du signal dégradé.

Cette série d'articles sera divisée d'une manière à ce que chaque composant soit développé dans son propre article(s).

## Étape 1 : Le codage source — Dire plus avec moins

Le message de l'exemple **« salut, tu es où ? »** contient **16 caractères** (espaces compris). En **UTF-8**, cela correspond à **17 octets**.

Mais a-t-on vraiment besoin de **17 × 8 = 136 bits** pour transmettre cette information ?

Réfléchis : dans la langue française, certaines lettres apparaissent beaucoup plus souvent que d'autres. Par exemple : le **« e »** est extrêmement fréquent, tandis que le **« w »** ou le **« x »** sont rares.

Cette inégalité de fréquence peut être exploitée pour réduire la quantité d'information à transmettre.

Le même principe s'applique (à peu près) aux images lorsqu'on les compresse au format **JPEG**.

L'idée du **codage source** est précisément de représenter l'information avec **le plus petit nombre de bits possible**.

Pour y parvenir, il faut s'appuyer sur des bases solides en **théorie de l'information**, afin de modéliser rigoureusement le concept d'information. On étudiera également les différents types de **codage source**, qu'ils soient **sans perte** ou **avec perte**.

Enfin, on expliquera en détail le fonctionnement de **JPEG**, aussi bien du point de vue **théorique** que **pratique**, et on terminera par un **LAB** dans lequel on essaiera d'implémenter nous-mêmes un mode de compression JPEG. *Franchement… c'est excitant, non ?*

## Étape 2 : Le codage canal — Se préparer au pire

Notre message est bien compressé et il est représenté par une séquence de bits optimisée. Mais ces bits vont traverser un canal hostile : un canal où il y a de l'interférence, de l'atténuation, du bruit… Ainsi, certains bits vont être corrompus.

Comment faire pour que le récepteur puisse quand même retrouver le message original ?

La réponse est contre-intuitive : on va **ajouter des bits supplémentaires**. Oui, tu as bien lu. On vient de compresser pour réduire le nombre de bits, et maintenant on en rajoute. Ça peut sembler absurde, mais ces bits supplémentaires ne sont pas n'importe lesquels, ils sont calculés de manière très précise à partir des bits de données.

C'est ce que nous allons étudier dans le chapitre consacré au **codage canal**. Cependant, je vous conseille vivement de commencer par le chapitre sur la **modélisation du canal (étape 4)**, où nous analyserons les contraintes auxquelles nous sommes confrontés dans la vie réelle. Cette étape est essentielle pour bien réfléchir, comprendre les problèmes posés par le canal, ainsi que les solutions et les techniques de codage canal mises en œuvre.

À la fin, nous comparerons les différentes techniques de **codage canal** en termes de **taux d'erreur**, à l'aide de simulations, afin d'en déduire le rôle et l'apport de chaque composant du code.

## Étape 3 : La modulation — Parler le langage du canal

À ce stade, tu as une séquence de bits, protégée par le codage canal. Mais un bit, c'est une abstraction mathématique. C'est un 0 ou un 1 dans la tête ou dans la mémoire d'un ordinateur. Le canal physique, lui, ne comprend pas les bits. Il transporte des **signaux** : des variations de tension dans un câble, des ondes électromagnétiques dans l'air, des impulsions lumineuses dans une fibre optique…

La modulation, c'est l'art de **traduire les bits en signaux physiques**.

L'idée de base est simple : on prend une onde "porteuse", soit une sinusoïde à une fréquence donnée, et on modifie une de ses caractéristiques en fonction des bits à transmettre :

**L'amplitude** : On fait varier la "hauteur" de l'onde. Par exemple : un bit 0, c'est une onde faible ; un bit 1, c'est une onde forte. C'est la modulation d'amplitude (AM).

**La fréquence** : On fait varier la vitesse d'oscillation. Par exemple : un bit 0, c'est une fréquence basse ; un bit 1, c'est une fréquence haute. C'est la modulation de fréquence (FM).

**La phase** : On décale le "timing" de l'onde. Par exemple : un bit 0, l'onde commence à un certain moment ; un bit 1, elle commence légèrement décalée. C'est la modulation de phase (PM).

Dans l'article consacré à la **modulation**, nous étudierons les différents types de modulation, en mettant en évidence leurs **principes de fonctionnement**, ainsi que leurs **avantages et leurs inconvénients** selon le contexte d'utilisation. Nous verrons comment le choix d'une modulation affecte le **débit de transmission**, l'**efficacité spectrale** et la **qualité du signal reçu**.

On analysera également la relation étroite entre la modulation, le **débit binaire** et la **robustesse face au bruit**, afin de comprendre les compromis fondamentaux imposés par les systèmes de communication.

Enfin, nous ferons le lien avec les **technologies contemporaines**, en expliquant quelles modulations sont utilisées dans des standards réels comme la **4G**, la **5G** et le **Wi-Fi**, et pourquoi ces choix ont été faits.

## Étape 4 : Le canal de transmission — Là où tout peut mal tourner

Le signal modulé part dans le canal. C'est le moment de vérité. Notre signal va subir toute sorte de changements, des changements qu'on ne peut pas contrôler, des changements aléatoires dépendant du type de canal.

Dans ce chapitre, que j'aime l'appeler "**Le voyage du signal… et ses galères**", on étudiera les différents types de perturbations que le canal peut exercer sur le signal. Pour ainsi déterminer les différents types de canal qu'on rencontre dans la vie réelle et les challenges qu'ils posent.

Cela va nous donner une idée précise, intuitive et profonde de tous les challenges que le canal pose. Et ainsi, pouvoir en trouver des solutions.

## Étape 5 : La démodulation — Retrouver les bits dans le chaos

De l'autre côté du canal, le récepteur récupère le signal qui arrive dégradé, déformé et noyé dans le bruit. Pourtant, quelque part dans ce signal se cachent les bits originaux.

Trouver ces bits est le travail de (drums….) **la démodulation**. Dans cette étape, on analyse le signal reçu pour en extraire les bits. Mais ce n'est pas une simple inversion mécanique. Le récepteur doit prendre des décisions en présence d'incertitude. Le récepteur doit se demander si ce bout de message ressemble-t-il davantage à un 0 ou à un 1 ? Parfois c'est évident, parfois c'est ambigu.

Dans le chapitre consacré à la démodulation, on étudiera comment le récepteur estime les caractéristiques du canal pour mieux interpréter le signal.

On fera une simulation de toutes les étapes précédentes pour voir et comparer les différents types de démodulation pour illustrer leurs avantages, leurs inconvénients ainsi que leurs cas d'utilisation dans les technologies quotidiennes.

## Étape 6 : Le décodage canal — Corriger les erreurs

Malgré tous les efforts de la démodulation, des erreurs persistent (certains bits détectés ne correspondent pas à ceux qui ont été envoyés). Heureusement, on avait prévu le coup. Souvenez-vous de l'étape 2 : le codage canal ? Et oui, c'est là où on voit son importance. À l'émission, le codage canal avait ajouté de la redondance, une redondance que le décodeur canal va exploiter pour corriger les erreurs.

*Comment ?* C'est ce qu'on va voir dans le chapitre consacré au décodage canal. Non seulement ça, mais on va retourner vers la théorie de l'information pour calculer "*le taux de correction et de détection d'un codage*".

## Étape 7 : Le décodage source — Retrouver le message original

Les bits sont maintenant corrects (espérons-le). Mais les bits ne sont pas encore le message original, mais une version compressée de l'information.

Cette étape peut sembler simple comparée aux précédentes, mais elle a ses subtilités. Pour les codages sans perte, la reconstruction est parfaite, on retrouve exactement l'original. Pour les codages avec perte (comme JPEG), on récupère une approximation, celle qui avait été jugée "suffisamment bonne" à l'émission.

Et voilà : le message "salut, tu es où ?" s'affiche sur l'écran du destinataire. Ce qui était de l'information est devenu des bits, puis des signaux, puis à nouveau des bits, puis à nouveau de l'information. Tout ce voyage en quelques millisecondes. *C'est joli non ?*

## Projet : la mise en œuvre de A à Z de la chaîne de transmission pour wifi (suivant le standard IEEE 802.11a)

À travers ce projet, nous avons parcouru l'ensemble de la chaîne de transmission, depuis la naissance de l'information jusqu'à sa reconstruction fidèle à la réception. Ce voyage, qui peut sembler abstrait au premier abord, révèle en réalité l'extraordinaire ingéniosité des systèmes de télécommunication modernes. Derrière chaque message échangé en quelques millisecondes se cache une succession de choix techniques, de compromis fondamentaux et de modèles théoriques soigneusement construits.

Ce projet ne se limite pas à une simple étude théorique. Il met en lumière le lien profond entre la **théorie de l'information**, les **modèles mathématiques**, et leur **implémentation concrète** dans des systèmes réels comme le Wi-Fi. Chaque étape (codage source, codage canal, modulation, transmission, démodulation et décodage) joue un rôle précis et indispensable, et c'est leur interaction cohérente qui rend la communication fiable possible dans un monde imparfait et bruyant.

En mettant en œuvre une chaîne de transmission complète de A à Z, vous serez confrontés aux mêmes questions que les ingénieurs des grandes industries des télécommunications : quels compromis choisir entre débit, robustesse et complexité ? Quelle technique est la plus adaptée à un canal donné ? Comment transformer une théorie élégante en un système fonctionnel et performant ?

## Conclusion :

L'ensemble de cette série d'articles, ainsi que les travaux pratiques et le projet de mise en œuvre associés, sera réalisé par **Haytham ZAABOUL, étudiant en ingénierie à l'ENSEEIHT**, avec l'encadrement et l'accompagnement de **chercheurs reconnus dans le domaine des télécommunications** et de **professeurs de l'ENSEEIHT**.

Cette démarche vise à garantir une approche à la fois **rigoureuse**, **pédagogique** et **scientifiquement solide**, en s'appuyant sur l'expertise académique et la recherche actuelle, afin de proposer un contenu fidèle aux fondements théoriques tout en restant ancré dans les systèmes réels.

Ce travail s'inscrit dans une volonté claire : construire une compréhension progressive, cohérente et accessible des télécommunications modernes, du concept à l'implémentation.

*Écrit par Haytham ZAABOUL*
