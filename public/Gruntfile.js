/**
 * Created by marcoazer on 2016-12-27.
 */

module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        connect:{
            main:{
                options: {
                    port: 80,
                    base: '.',
                    hostname: 'localhost',
                    keepalive: true,
                    liverload: true
                }
            }
        }
    });

    grunt.registerTask('default', [
        'build'
    ]);


    grunt.registerTask('echo', function () {
        grunt.log.write("grunt is running\n");
    });

    grunt.registerTask('build', [
        'echo',
        'serve'
    ]);

    grunt.registerTask('serve', [
        'connect:main'
    ]);
};
