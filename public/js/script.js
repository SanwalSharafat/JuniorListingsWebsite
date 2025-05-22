(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})();

  const taxToggle = document.getElementById("switchCheckChecked");

    taxToggle.addEventListener("click", () => {
      const gst = document.getElementById("taxinfo");
      const isHidden = gst.classList.toggle("hidden");
      gst.style.display = isHidden ? "none" : "flex";
    });