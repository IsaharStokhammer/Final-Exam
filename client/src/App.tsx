// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AttackTypesPage from './pages/AttackTypes';
import Navbar from './components/NavBar/NavBar';
import AreasWithTheHighestAverageCasualties from './pages/AreasWithTheHighestAverageCasualties';
import Trands from './pages/Trands';
import AllAttacksOfGroup from './pages/AllAttacksOfGroup';
import AreasOrganIsNumberOne from './pages/AreasOrganIsNumberOne';
import GroupsByYear from './pages/groupsByYear';
import TopGroups from './pages/TopGroups';
import CrudPage from './pages/CrudPage';
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/AttackTypesPage" element={<AttackTypesPage />} />
        <Route path="/AreasWithTheHighestAverageCasualties" element={<AreasWithTheHighestAverageCasualties />} />
        <Route path="/EventsByYearPage" element={<Trands />} />
        <Route path="/AllEventsOfGroup" element={<AllAttacksOfGroup />} />
        <Route path="/AreasOrganIsNumberOne" element={<AreasOrganIsNumberOne />} />
        <Route path="/GroupsByYear" element={<GroupsByYear />} />
        <Route path="/TopGroups" element={<TopGroups />} />
        <Route path="/crud" element={<CrudPage />} />
      </Routes>
    </Router>
  );
};

export default App;
