function updateJobTitle() {
    var district = document.getElementById("district");
    var platform = document.getElementById("platform");
    
    var districtText = district.options[district.selectedIndex].text;
    var platformText = platform.options[platform.selectedIndex].text;
    
    // Update the WhatsApp link dynamically
    var whatsappLink = document.getElementById("whatsapp-btn");
    var message = "Hi, I am interested in a Delivery Partner job. Details: Platform: " + platformText + ", District: " + districtText;
    var encodedMessage = encodeURIComponent(message);
    
    whatsappLink.href = "https://wa.me/918355837077?text=" + encodedMessage;
}


// function updateWhatsAppLink() {
//     const districtSelect = document.getElementById("district");
//     const platformSelect = document.getElementById("platform");
//     const whatsappBtn = document.getElementById("whatsapp-btn");

//     const district = districtSelect.value;
//     const platform = platformSelect.value;

//     // Create the message
//     const message = `Hi, I am interested in a Delivery Partner job. 
//     Details: 
//     - Platform: ${platform} 
//     - District: ${district}`;

//     // Encode the message for the URL
//     const encodedMessage = encodeURIComponent(message);

//     // Update the button's href
//     whatsappBtn.href = `https://wa.me/918355837077?text=${encodedMessage}`;
// }


function updateWhatsAppLink() {
    const district = document.getElementById("district").value;
    const platform = document.getElementById("platform").value;
    const whatsappBtn = document.getElementById("whatsapp-btn");

    // Validation: Check if both selections have a value
    if (district === "" || platform === "") {
        // Option A: Disable the button if not filled
        whatsappBtn.style.opacity = "0.5";
        whatsappBtn.style.pointerEvents = "none";
        return;
    } else {
        // Option B: Enable the button
        whatsappBtn.style.opacity = "1";
        whatsappBtn.style.pointerEvents = "auto";
    }

    // Generate link only if both are selected
    const districtText = document.getElementById("district").options[document.getElementById("district").selectedIndex].text;
    const platformText = document.getElementById("platform").options[document.getElementById("platform").selectedIndex].text;

    const message = `Hi, I am interested in a delivery job in ${districtText} for ${platformText}.`;
    whatsappBtn.href = `https://wa.me/919000210321?text=${encodeURIComponent(message)}`;
}

// Ensure it runs on load to set the initial disabled state
window.onload = updateWhatsAppLink;

// Add event listeners to update the link whenever the user changes a dropdown
document.getElementById("district").addEventListener("change", updateWhatsAppLink);
document.getElementById("platform").addEventListener("change", updateWhatsAppLink);

// Call it once on page load to set the initial link
updateWhatsAppLink();

