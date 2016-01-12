'use strict';

module.exports = {

    renderIndex : (req, res) => {
        res.render('index', { title: 'Watch torrent' });
    }

};
