const picTool = {
    getThumb: (pic) => {
        if (!pic) {
            return '/PROFILE-BLANK_THUMB.png';
        } else {
            return pic.split('.')[0] + '.' + pic.split('.')[1] + '_THUMB.' + pic.split('.')[2];
        }
    },
    getSmall: (pic) => {
        if (!pic) {
            return '/PROFILE-BLANK_SMALL.png';
        } else {
            return pic.split('.')[0] + '.' + pic.split('.')[1] + '_SMALL.' + pic.split('.')[2];
        }
    },
    getMedium: (pic) => {
        if (!pic) {
            return '/PROFILE-BLANK_MEDIUM.png';
        } else {
            return pic.split('.')[0] + '.' + pic.split('.')[1] + '_MEDIUM.' + pic.split('.')[2];
        }
    },
    getLarge: (pic) => {
        if (!pic) {
            return '/PROFILE-BLANK_LARGE.png';
        } else {
            return pic.split('.')[0] + '.' + pic.split('.')[1] + '_LARGE.' + pic.split('.')[2];
        }
    },
    getProfilePics: (userNode) => {
        return {
            profile_medium : userNode.profilePic ? userNode.profilePic.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_MEDIUM.' + userNode.profilePic.split('.')[2] : '/PROFILE-BLANK_MEDIUM.png',
            profile_large : userNode.profilePic ? userNode.profilePic.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_LARGE.' + userNode.profilePic.split('.')[2] : '/PROFILE-BLANK_LARGE.png',
            pic1_small : userNode.pic1 ? userNode.pic1.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_SMALL.' + userNode.pic1.split('.')[2] : '/PROFILE-BLANK_SMALL.png',
            pic1_large : userNode.pic1 ? userNode.pic1.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_LARGE.' + userNode.pic1.split('.')[2] : '/PROFILE-BLANK_LARGE.png',
            pic2_small : userNode.pic2 ? userNode.pic2.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_SMALL.' + userNode.pic2.split('.')[2] : '/PROFILE-BLANK_SMALL.png',
            pic2_large : userNode.pic2 ? userNode.pic2.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_LARGE.' + userNode.pic2.split('.')[2] : '/PROFILE-BLANK_LARGE.png',
            pic3_small : userNode.pic3 ? userNode.pic3.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_SMALL.' + userNode.pic3.split('.')[2] : '/PROFILE-BLANK_SMALL.png',
            pic3_large : userNode.pic3 ? userNode.pic3.split('.')[0] + '.' + userNode.profilePic.split('.')[1] + '_LARGE.' + userNode.pic3.split('.')[2] : '/PROFILE-BLANK_LARGE.png'
        }
    }
}

export default picTool;