/**
 * Simplified PDF Viewer with custom start page support
 * (No navigation buttons or page counter)
 */
document.addEventListener('DOMContentLoaded', function () {
    // PDF elements
    const cardImages = document.querySelectorAll('.card-image');
    const pdfPopup = document.getElementById('pdfPopup');
    const pdfClose = document.getElementById('pdfClose');
    const pdfTitle = document.getElementById('pdfTitle');
    const pdfFrame = document.getElementById('pdfFrame');

    // Exit if PDF elements aren't present
    if (!pdfPopup || !pdfFrame) return;

    // PDF links and their start page configuration
    const pdfConfig = [
        { url: document.getElementById('pdf-link-1')?.href, startPage: 19 },
        { url: document.getElementById('pdf-link-2')?.href, startPage: 2 },
        { url: document.getElementById('pdf-link-3')?.href, startPage: 12 }
    ];

    // Function to append page number to PDF URL
    function addPageToUrl(url, pageNum) {
        if (!url) return url;

        // Remove any existing hash with page parameter
        if (url.includes('#page=')) {
            url = url.replace(/#page=\d+/, '');
        }

        // Add the page parameter
        return `${url}#page=${pageNum}`;
    }

    // Open PDF popup when clicking on card image
    cardImages.forEach((cardImage, index) => {
        cardImage.addEventListener('click', function () {
            // Get the configuration for this PDF
            const config = pdfConfig[index % pdfConfig.length];

            // Get title from the card
            const cardTitle = this.closest('.card').querySelector('.card-title').textContent;
            if (pdfTitle) pdfTitle.textContent = cardTitle;

            // Load the PDF with the start page in URL
            if (config && config.url) {
                pdfFrame.src = addPageToUrl(config.url, config.startPage);
            }

            // Show popup
            pdfPopup.classList.add('active');

            // Prevent scrolling on the body
            document.body.style.overflow = 'hidden';
        });
    });

    // Close PDF popup
    if (pdfClose) {
        pdfClose.addEventListener('click', function () {
            pdfPopup.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close popup when clicking outside the PDF container
    pdfPopup.addEventListener('click', function (e) {
        if (e.target === pdfPopup) {
            pdfPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Keyboard 'Escape' to close popup
    document.addEventListener('keydown', function (e) {
        if (!pdfPopup.classList.contains('active')) return;

        if (e.key === 'Escape') {
            pdfPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});