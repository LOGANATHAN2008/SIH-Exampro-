
        document.addEventListener('DOMContentLoaded', () => {
            if(typeof LiquidSelect !== 'undefined') {
                new LiquidSelect('state', 'Select State', true);
                new LiquidSelect('district', 'Select District', true);
                new LiquidSelect('collegeSelect', 'Select College', true);
            }
        });
    