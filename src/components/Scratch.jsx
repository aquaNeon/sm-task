import React, { useEffect } from 'react';
import LegendaryCursor from 'legendary-cursor';

const Scratch = () => {
    useEffect(() => {
        // Initialize LegendaryCursor with proper settings.
        LegendaryCursor.init({
            lineSize: 0.075,
            opacityDecrement: 0.5,
            speedExpFactor: 0.1,
            lineExpFactor: 0.5,
            sparklesCount: 2,
            maxOpacity: 0.85,
            texture1: 'textures/9.png', // storyme
            texture2: 'textures/8.jpg', // on press texture
        });

        // Cleanup LegendaryCursor on component unmount.
        return () => {
            LegendaryCursor.destroy();
        };
    }, []);

    return null;
};

export default Scratch;