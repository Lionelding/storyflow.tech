/**
 * PDF Viewer functionality
 */
document.addEventListener('DOMContentLoaded', function () {
    // PDF elements
    const cardImages = document.querySelectorAll('.card-image');
    const pdfPopup = document.getElementById('pdfPopup');
    const pdfClose = document.getElementById('pdfClose');
    const pdfTitle = document.getElementById('pdfTitle');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const currentPage = document.getElementById('currentPage');
    const totalPages = document.getElementById('totalPages');
    const pdfFrame = document.getElementById('pdfFrame');

    // Exit if PDF elements aren't present
    if (!pdfPopup || !pdfFrame) return;

    // PDF links
    const pdfLinks = [];
    for (let i = 1; i <= 3; i++) {
        const link = document.getElementById(`pdf-link-${i}`);
        if (link) pdfLinks.push(link.href);
    }

    // Variables to track current PDF state
    let currentPageNum = 1;
    let maxPages = 10; // Default value

    // Open PDF popup when clicking on card image
    cardImages.forEach((cardImage, index) => {
        cardImage.addEventListener('click', function () {
            // Get title from the card
            const cardTitle = this.closest('.card').querySelector('.card-title').textContent;
            pdfTitle.textContent = cardTitle;

            // Load the PDF file
            if (pdfLinks.length > 0) {
                pdfFrame.src = pdfLinks[index % pdfLinks.length];
            }

            // Reset to page 1
            currentPageNum = 1;
            currentPage.textContent = currentPageNum;

            // Set total pages based on card index (just for demo)
            maxPages = 18;
            totalPages.textContent = maxPages;

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

    // Previous page button
    if (prevPage) {
        prevPage.addEventListener('click', function () {
            if (currentPageNum > 1) {
                currentPageNum--;
                currentPage.textContent = currentPageNum;
                // Send message to PDF.js viewer to go to previous page
                try {
                    pdfFrame.contentWindow.postMessage({ action: 'previousPage' }, '*');
                } catch (e) {
                    console.log('Could not navigate to previous page:', e);
                }
            }
        });
    }

    // Next page button
    if (nextPage) {
        nextPage.addEventListener('click', function () {
            if (currentPageNum < maxPages) {
                currentPageNum++;
                currentPage.textContent = currentPageNum;
                // Send message to PDF.js viewer to go to next page
                try {
                    pdfFrame.contentWindow.postMessage({ action: 'nextPage' }, '*');
                } catch (e) {
                    console.log('Could not navigate to next page:', e);
                }
            }
        });
    }

    // Keyboard navigation for PDF
    document.addEventListener('keydown', function (e) {
        if (!pdfPopup.classList.contains('active')) return;

        if (e.key === 'Escape') {
            pdfPopup.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft' && currentPageNum > 1) {
            currentPageNum--;
            currentPage.textContent = currentPageNum;
            try {
                pdfFrame.contentWindow.postMessage({ action: 'previousPage' }, '*');
            } catch (e) {
                console.log('Could not navigate to previous page:', e);
            }
        } else if (e.key === 'ArrowRight' && currentPageNum < maxPages) {
            currentPageNum++;
            currentPage.textContent = currentPageNum;
            try {
                pdfFrame.contentWindow.postMessage({ action: 'nextPage' }, '*');
            } catch (e) {
                console.log('Could not navigate to next page:', e);
            }
        }
    });
});