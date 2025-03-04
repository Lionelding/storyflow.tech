/**
 * FAQ Accordion functionality
 */
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        // Add ARIA attributes for accessibility
        const answerId = `faq-answer-${Math.random().toString(36).substr(2, 9)}`;
        const answer = item.querySelector('.faq-answer');
        answer.id = answerId;
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answerId);

        question.addEventListener('click', () => {
            // Close all other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    otherItem.classList.remove('active');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the current FAQ item
            const isExpanded = item.classList.contains('active');
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isExpanded);
        });
    });
});