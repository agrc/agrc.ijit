require([
    'ijit/widgets/authentication/UserAdmin',
    'dojo/dom-construct',
    'dojo/_base/window',
    'stubmodule',
    'dojo/Deferred',
    'dojo/dom-style',
    'dojo/text!ijit/widgets/tests/data/users.json'

], function(
    UserAdmin,
    domConstruct,
    win,
    stubmodule,
    Deferred,
    domStyle,
    usersTxt
) {
    describe('ijit/widgets/authentication/UserAdmin', function() {
        var testWidget;
        var destroy = function(widget) {
            widget.destroyRecursive();
            widget = null;
        };
        beforeEach(function() {
            testWidget = new UserAdmin({}, domConstruct.create('div', {}, win.body()));
            testWidget.startup();
            testWidget.login.user = {
                adminToken: 'blah'
            };
        });
        afterEach(function() {
            destroy(testWidget);
        });
        it('create a valid object', function() {
            expect(testWidget).toEqual(jasmine.any(UserAdmin));
        });
        describe('getUsers', function() {
            // https://github.com/agrc/StubModule/issues/3
            it('gets all users from web service', function(done) {
                var def = new Deferred();
                var xhrSpy = jasmine.createSpy('xhr').and.returnValue(def);
                stubmodule('ijit/widgets/authentication/UserAdmin', {
                    'dojo/request': xhrSpy
                }).then(function (StubbedModule) {
                    var testWidget2 = new StubbedModule({}, domConstruct.create('div', {}, win.body()));
                    spyOn(testWidget2, 'showWaitingUsers');
                    testWidget2.login.user = {
                        adminToken: 'blah'
                    };

                    testWidget2.getUsers();

                    expect(xhrSpy).toHaveBeenCalled();

                    def.resolve();

                    expect(testWidget2.showWaitingUsers).toHaveBeenCalled();

                    destroy(testWidget2);

                    done();
                });
            });
        });
        describe('onError', function() {
            it('show\'s the error message', function() {
                var msg = 'blah';
                testWidget.onError({
                    message: msg
                });

                expect(testWidget.errMsgDiv.innerHTML).toBe(msg);
                expect(domStyle.get(testWidget.errMsgDiv, 'display')).toBe('block');
            });
        });
        describe('showWaitingUsers', function() {
            it('builds user object for each user', function() {
                var users = [{
                    email: 'email1',
                    name: 'name1',
                    agency: 'name1'
                }, {
                    email: 'email2',
                    name: 'name2',
                    agency: 'name2'
                }];
                testWidget.showWaitingUsers({
                    result: users
                });

                expect(testWidget.userContainer.children.length).toBe(2);
            });
            it('show\'s a message when there are no users', function() {
                domStyle.set(testWidget.noUsersMsg, 'display', 'none'); // in UserAdmin.css
                testWidget.showWaitingUsers({
                    result: []
                });

                expect(domStyle.get(testWidget.noUsersMsg, 'display')).toBe('block');
            });
        });
        describe('exportToCsv', function () {
            beforeEach(function () {
                testWidget.showApprovedUsers(JSON.parse(usersTxt));
            });
            it('exports the correct number of lines', function () {
                expect(testWidget.exportToCsv().split('\n').length).toBe(6);
            });
            it('first line is field names', function () {
                expect(testWidget.exportToCsv().split('\n')[0])
                    .toEqual('"userId","first","last","email","agency","role","lastLogin","phone","address",' +
                        '"city","state","zip","startDate","endDate","counties","locationTxt","layers","application"');
            });
            it('exports the right data values', function () {
                expect(testWidget.exportToCsv().split('\n')[2])
                    .toEqual('"dd792ddb-66e7-4df8-a821-44a50650d210","test","test","test@test.com","test","water",' +
                        '"0","tewT","test","test","test","test","0","1421260837288","CARBON","test","s0,s3","deq"');
            });
            it('skips adminToken', function () {
                expect(testWidget.exportToCsv().split('\n')[5].split(','))
                    .not.toContain('"users/1.5c6aa4d0-d363-4d13-938d-2d7d9b1ad47d"');
            });
        });
    });
});