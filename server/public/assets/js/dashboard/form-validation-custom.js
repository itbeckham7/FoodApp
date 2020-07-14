"use strict";
(function() {
        'use strict';
        window.addEventListener('load', function() {
            var forms = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();

                        $('.add-product:has(.form-control:invalid) .invalid-feedback').css('display', 'block');
                    }
                    form.classList.add('was-validated');

                }, false);
            });
        }, false);
})();