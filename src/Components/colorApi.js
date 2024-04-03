import axios from 'axios';

// docs: https://www.thecolorapi.com/docs
const baseUrl = 'https://www.thecolorapi.com';

const getRandomColor = async () => {
    try {
        const hex = Math.floor(Math.random() * 16777215).toString(16);
        const url = `${baseUrl}/id?hex=${hex}`;
        const response = await axios.get(url);
        return response.data.hex.value;
    } catch (error) {
        console.error('Error fetching color:', error);
    }
};

const getColorPalette = async (searchInput) => {
    try {
        const url = `${baseUrl}/scheme?hex=${searchInput}`;
        const response = await axios.get(url);
        return response.data.colors.map((color) => color.hex.value);
    } catch (error) {
        console.error('Error fetching color palette:', error);
    }
};

export { getRandomColor, getColorPalette };
