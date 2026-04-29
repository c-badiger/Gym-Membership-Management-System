const bcrypt = require('bcryptjs');

const checkHash = async () => {
    const hash = '$2b$10$wE4H5S6YmC1V4O9J.Y5b5uT2E4W9T5P9o.t0.y2J5Y6F3I6N.f4uG';
    const isMatch = await bcrypt.compare('admin123', hash);
    console.log('Matches admin123:', isMatch);
    
    const isMatch2 = await bcrypt.compare('admin', hash);
    console.log('Matches admin:', isMatch2);

    const isMatch3 = await bcrypt.compare('password', hash);
    console.log('Matches password:', isMatch3);

    const newHash = await bcrypt.hash('admin123', 10);
    console.log('New hash for admin123:', newHash);
};

checkHash();
