/*global define:true, describe:true , it:true , expect:true,
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(['gmodel'], function(Gmodel) {

    describe('just checking', function() {

        it('Gmodel should be loaded', function() {
            expect(Gmodel).toBeTruthy();
            var gmodel = new Gmodel();
            expect(gmodel).toBeTruthy();
        });

        it('Gmodel should initialize', function() {
            var gmodel = new Gmodel();
            var output   = gmodel.init();
            var expected = gmodel;
            expect(output).toEqual(expected);
        });

    });

});