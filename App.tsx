import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArticleView from './pages/ArticleView';
import DirectoryView from './pages/DirectoryView';
import Tags from './pages/Tags';
import { ThemeProvider } from './context/ThemeContext';
import { ArticleProvider } from './context/ArticleContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ArticleProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:slug" element={<ArticleView />} />
              <Route path="/directory/:directory" element={<DirectoryView />} />
              <Route path="/directory" element={<DirectoryView />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/tags/:tag" element={<Tags />} />
            </Routes>
          </Layout>
        </Router>
      </ArticleProvider>
    </ThemeProvider>
  );
};

export default App;