import Service from './service';

describe('Service', () => {
	let service, settings;

	beforeEach(() => {
		service = null;
		settings = null;
	});

	describe('constructor', () => {
		service = new Service();

		it('should be instantiated', () => {
			expect(service instanceof Service);
		});
	});

	describe('static.getInstance', () => {
		it('should return an Instance of the service', () => {
			service = Service.getInstance();

			expect(service instanceof Service);
		});

		it('should return a singleton instance of the service', () => {
			service = Service.getInstance();
			const _service = new Service();

			assert.strictEqual(service, _service);
		});
	});
});
