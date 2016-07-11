// Coordinates the interaction of elements on the page
(function() {

    var DOM = {};
    DOM.required = $(".required");
    DOM.total = $(".total");
    DOM.secret = $(".secret");
    DOM.distributesize = $(".distributesize");
    DOM.recreatesize = $(".recreatesize");
    DOM.error = $(".error");
    DOM.generated = $(".generated");
    DOM.parts = $(".parts");
    DOM.combined = $(".combined");

    function init() {
        // Events
        DOM.required.addEventListener("input", generateParts);
        DOM.total.addEventListener("input", generateParts);
        DOM.secret.addEventListener("input", generateParts);
        DOM.parts.addEventListener("input", combineParts);
    }

    function generateParts() {
        // Clear old generated
        DOM.generated.innerHTML = "";
        // Get the input values
        var secret = DOM.secret.value;
        var secretHex = secrets.str2hex(secret);
        var total = parseFloat(DOM.total.value);
        var required = parseFloat(DOM.required.value);
        // validate the input
        if (total < 2) {
            DOM.error.textContent = "Total must be at least 1";
            return;
        }
        else if (total > 255) {
            DOM.error.textContent = "Total must be at most 255";
            return;
        }
        else if (required < 2) {
            DOM.error.textContent = "Required must be at least 1";
            return;
        }
        else if (required > 255) {
            DOM.error.textContent = "Required must be at most 255";
            return;
        }
        else if (isNaN(total)) {
            DOM.error.textContent = "Invalid value for total";
            return;
        }
        else if (isNaN(required)) {
            DOM.error.textContent = "Invalid value for required";
            return;
        }
        else if (required > total) {
            DOM.error.textContent = "Required must be less than total";
            return;
        }
        else if (secret.length == 0) {
            DOM.error.textContent = "Secret is blank";
            return;
        }
        else {
            DOM.error.textContent = "";
        }
        // Generate the parts to share
        var minPad = 1024; // see https://github.com/amper5and/secrets.js#note-on-security
        var shares = secrets.share(secretHex, total, required, minPad);
        // Display the parts
        for (var i=0; i<shares.length; i++) {
            var share = shares[i];
            var li = document.createElement("li");
            li.classList.add("part");
            li.textContent = share;
            DOM.generated.appendChild(li);
        }
        // Update the plain-language info
        DOM.distributesize.textContent = total;
        DOM.recreatesize.textContent = required;
    }

    function combineParts() {
        // Clear old text
        DOM.combined.textContent = "";
        // Get the parts entered by the user
        var partsStr = DOM.parts.value;
        // Validate and sanitize the input
        var parts = partsStr.trim().split(/\s+/);
        // Combine the parts
        try {
            var combinedHex = secrets.combine(parts);
            var combined = secrets.hex2str(combinedHex);
        }
        catch (e) {
            DOM.combined.textContent = e.message;
        }
        // Display the combined parts
        DOM.combined.textContent = combined;
    }

    init();

})();
