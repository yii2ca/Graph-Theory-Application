import React from 'react';
import { Menu, X, Train } from 'lucide-react';
import { useGraph } from '../../contexts/GraphContext';
import './Header.css';

const Header = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
  } = useGraph();

  return (
    <>
      <header className="header">
        <div className="header__left">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="header__menu-btn"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="header__logo">
            <Train size={28} />
            <div className="header__branding">
              <h1 className="header__title">Ứng dụng đường sắt tối ưu</h1>
              {/* <p className="header__subtitle">Minimum Spanning Tree Visualization</p> */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;