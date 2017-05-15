(function () {
	'use strict';

	class AvatarService {

		constructor () {
			this._avatars = {
				'Tim': 'http://i.imgur.com/FHMnsVNt.jpg',
				'Matt': '//1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60?s=200&r=pg&d=mm'
			};

			this._defaultAvatar = 'https://unsplash.it/200/200/?random';
		}

		getAvatar (name = '') {
			return this._avatars[name] || this._defaultAvatar;
		}
	}

	//export
	window.AvatarService = AvatarService;
})();


