import React, { Component } from 'react';
import SearchIcon from '@mui/icons-material/Search';
// import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomColor, getColorPalette } from './Components/colorApi';
import colorToHex from './Components/colornames';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            colours: [],
            copiedColourId: null,
            searchInput: '',
            palette: [],
        };
    }

    componentDidMount() {
        this.generateColours();
    }

    generateColours = async () => {
        const maxColorBoxes = 21;
        const colorPromises = Array.from({ length: maxColorBoxes }, () =>
            getRandomColor()
        );
        try {
            const colours = await Promise.all(colorPromises);
            this.setState({ colours: colours.filter(Boolean), copiedColourId: null });
        } catch (error) {
            console.error('Error generating colors:', error);
        }
    };

    handleSearch = async () => {
        const { searchInput } = this.state;

        if (searchInput.length > 0) {
            // get hex value of searched color
            const inputLowerCase = searchInput.toLowerCase();
            const hexVal = colorToHex.find(
                (color) => color.name.toLowerCase() === inputLowerCase
            );

            console.log('Search hex:', hexVal.hex);

            if (hexVal.hex) {
                // remove # from hex value
                const cleanHex = hexVal.hex.slice(1);
                // get matching colors if color name is found
                const palette = (await getColorPalette(cleanHex)) || [];
                this.setState({ palette });
            } else {
                // no match found
                console.log('No matching color found');
                this.setState({ palette: [] });
            }
        } else {
            this.setState({ palette: [] });
        }
    };

    copyHexCode = (hexValue, index) => {
        navigator.clipboard
            .writeText(hexValue)
            .then(() => {
                this.setState({ copiedColourId: index });
            })
            .catch(() => {
                alert('Failed to copy color code');
            });
    };

    render() {
        const { colours, palette } = this.state;
        const colourList = palette.length > 0 ? palette : colours;

        return (
            <div>
                {/* Search */}
                <div className='search-container'>
                    {/* clear search */}
                    {palette.length > 0 && (
                        <button
                            className='clear-search'
                            onClick={() =>
                                this.setState({ searchInput: '', palette: [] })
                            }>
                            <CloseIcon />
                        </button>
                    )}

                    <input
                        type='text'
                        className='search-input'
                        placeholder='Search for a color'
                        value={this.state.searchInput}
                        onChange={(e) =>
                            this.setState((prevState) => ({
                                searchInput: e.target.value,
                            }))
                        }
                    />
                    <button className='search-icon-btn' onClick={this.handleSearch}>
                        <SearchIcon />
                    </button>
                </div>

                {/* Color Palette */}
                <ul className='container'>
                    {colourList.map((hexValue, index) => (
                        <li
                            className='color'
                            key={hexValue}
                            onClick={() => this.copyHexCode(hexValue, index)}>
                            <div
                                className='rect-box'
                                style={{ background: hexValue }}></div>
                            <span className='hex-value'>
                                {hexValue}
                                {this.state.copiedColourId === index && (
                                    <p className='copied-message'>Copied</p>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default App;
