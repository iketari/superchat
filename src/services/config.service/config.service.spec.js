import configService from './index';

describe('Config service', () => {


    describe('get', () => {
        it('should return value if the key exists', () => {
            const value = configService.get('firebase');
            expect(value).to.be.ok;
        });

        it('should return null if the key not exists', () => {
            const value = configService.get('NOT_EXISTS');
            expect(value).to.be.null;
        });

        it('should return value if the complex key exists', () => {
            const value = configService.get('firebase.apiKey');
            expect(value).to.be.ok;
        });

        it('should return null if the complex key not exists', () => {
            const value = configService.get('firebase.NOT_EXISTS');
            expect(value).to.be.null;
        });

        it('should return null if the complex key not exists at all', () => {
            const value = configService.get('WOO.HOO');
            expect(value).to.be.null;
        });
    });
});
