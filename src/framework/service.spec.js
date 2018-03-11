import Service from './service';

describe('Service', () => {
	let service, service2;

	beforeEach(() => {
		service = null;
	});

	describe('constructor', () => {
		service = new Service();

		it('should be instantiated', () => {
			expect(service instanceof Service);
		});

		it('should return one instance of the service or throw an error', () => {
			function createNew() {
				new Service();
			}

			expect(createNew).to.throw();
		});
	});

	describe('static.getInstance', () => {
		it('should return a singleton instance of the service', () => {
			service = Service.getInstance();
			service2 = Service.getInstance();

			expect(service).to.equal(service2);
		});

		it('should return an Instance of the service', () => {
			service = Service.getInstance();

			expect(service instanceof Service);
		});
	});
});
