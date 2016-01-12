'use strict';

module.exports = {

    renderIndex : (req, res) => {
        res.render('index', {
            title: 'Watch torrent',
            analytics_id: process.env.ANALYTICS_ID
        });
    }

};
