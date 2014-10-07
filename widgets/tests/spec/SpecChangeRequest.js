require([
    'ijit/widgets/notify/ChangeRequest',

    'dojo/dom-construct',

    'stubmodule'
], function(
    WidgetUnderTest,

    domConstruct,

    stubmodule
) {
    describe('ijit/widgets/notify/ChangeRequest', function() {
        var widget;
        var destroy = function(widget) {
            widget.destroyRecursive();
            widget = null;
        };

        beforeEach(function() {
            widget = new WidgetUnderTest(null, domConstruct.create('div', null, document.body));
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a ChangeRequest', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('notify', function() {
            var stubWidget;
            var post;
            beforeEach(function(done) {
                post = jasmine.createSpy('post').and.returnValue({
                    then: function() {

                    }
                });
                stubmodule('ijit/widgets/notify/ChangeRequest', {
                    'dojo/request': {
                        post: post
                    }
                }).then(function(Stub) {
                    stubWidget = new Stub({
                        map: {
                            layerIds: [1],
                            on: function() {

                            }
                        }
                    }, domConstruct.create('div', {}, document.body));
                    spyOn(stubWidget, '_validate').and.returnValue(true);

                    done();
                });
            });
            afterEach(function() {
                destroy(stubWidget);
            });
            it('notifies as anonymous', function() {
                var options = {
                    email: {
                        toIds: [2],
                        fromId: 2
                    },
                    template: {
                        templateId: 3,
                        templateValues: {
                            description: '',
                            application: window.location.href,
                            basemap: 1,
                            user: 'anonymous'
                        }
                    }
                };

                stubWidget.submitRedline();

                expect(post).toHaveBeenCalled();
                expect(post.calls.mostRecent().args[1].data).toEqual(JSON.stringify(options));

            });
            it('notifies as logged in user', function() {
                window.AGRC = {
                    user: {
                        email: 'hi'
                    }
                };

                var options = {
                    email: {
                        toIds: [2],
                        fromId: 2
                    },
                    template: {
                        templateId: 3,
                        templateValues: {
                            description: '',
                            application: window.location.href,
                            basemap: 1,
                            user: 'hi'
                        }
                    }
                };

                stubWidget.submitRedline();

                expect(post).toHaveBeenCalled();
                expect(post.calls.mostRecent().args[1].data).toEqual(JSON.stringify(options));
            });
        });
    });
});