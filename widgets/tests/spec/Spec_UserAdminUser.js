require([
    'ijit/widgets/authentication/_UserAdminUser',

    'dojo/dom-construct'
], function(
    WidgetUnderTest,

    domConstruct
) {
    describe('ijit/widgets/authentication/_UserAdminUser', function() {
        var widget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };

        beforeEach(function() {
            widget = new WidgetUnderTest({
                first: 'Scott',
                last: 'Davis',
                email: 'stdavis@utah.gov',
                role: 'publisher',
                roles: ['publisher', 'viewer', 'admin'],
                agency: 'AGRC',
                lastLogin: 1412283976527
            }, domConstruct.create('div', null, document.body));
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a _UserAdminUser', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('postCreate', function () {
            it('builds role options into select', function () {
                expect(widget.roleSelect.children.length).toBe(3);
            });
        });
        describe('isValid', function () {
            it('returns false if not values have changed', function () {
                expect(widget.isValid()).toBe(false);
            });
            it('returns true is something changes', function () {
                widget.emailTxt.value = 'different';

                expect(widget.isValid()).toBe(true);
            });
            it('returns false if a value is blank', function () {
                widget.emailTxt.value = '';

                expect(widget.isValid()).toBe(false);
            });
        });
    });
});
