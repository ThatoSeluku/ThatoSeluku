// Go to Market Survey Functionality
(function() {
    'use strict';

    let currentProject = '';
    let currentStep = 1;
    let responses = {
        q1: 0,
        q2: 0,
        q3: 0
    };

    const modal = document.getElementById('gtm-modal');
    const closeBtn = document.querySelector('.gtm-close');
    const progressBar = document.getElementById('gtm-progress-bar');
    const gtmButtons = document.querySelectorAll('.gtm-button');

    // Initialize - Load and display existing scores
    function init() {
        updateAllScores();

        // Add click listeners to GTM buttons
        gtmButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                currentProject = this.getAttribute('data-project');

                // Check if user has already voted
                if (hasVoted(currentProject)) {
                    alert('You have already voted for this project. Thank you!');
                    return;
                }

                openModal();
            });
        });

        // Close button
        closeBtn.addEventListener('click', closeModal);

        // Close when clicking outside modal
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Rating button handlers
        const ratingButtons = document.querySelectorAll('.rating-btn');
        ratingButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                handleRating(value);
            });
        });
    }

    function openModal() {
        currentStep = 1;
        responses = { q1: 0, q2: 0, q3: 0 };

        // Reset modal
        document.getElementById('step-1').style.display = 'block';
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'none';
        document.getElementById('step-thankyou').style.display = 'none';

        updateProgress();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function handleRating(value) {
        // Store response
        responses[`q${currentStep}`] = value;

        // Highlight selected button briefly
        const currentStepDiv = document.getElementById(`step-${currentStep}`);
        const buttons = currentStepDiv.querySelectorAll('.rating-btn');
        buttons.forEach(btn => {
            if (parseInt(btn.getAttribute('data-value')) === value) {
                btn.classList.add('selected');
            }
        });

        // Move to next step after short delay
        setTimeout(() => {
            buttons.forEach(btn => btn.classList.remove('selected'));

            if (currentStep < 3) {
                // Move to next question
                document.getElementById(`step-${currentStep}`).style.display = 'none';
                currentStep++;
                document.getElementById(`step-${currentStep}`).style.display = 'block';
                updateProgress();
            } else {
                // All questions answered - save and show thank you
                saveVote();
                showThankYou();
            }
        }, 300);
    }

    function updateProgress() {
        const progress = (currentStep / 3) * 100;
        progressBar.style.width = progress + '%';
    }

    function saveVote() {
        // Calculate score
        const totalPoints = responses.q1 + responses.q2 + responses.q3;
        const score = Math.round((totalPoints / 15) * 100);

        // Get existing data
        const data = getProjectData(currentProject);

        // Update data
        data.votes += 1;
        data.totalScore += score;
        data.averageScore = Math.round(data.totalScore / data.votes);

        // Save to localStorage
        localStorage.setItem(`gtm-${currentProject}`, JSON.stringify(data));

        // Mark user as voted
        localStorage.setItem(`gtm-voted-${currentProject}`, 'true');

        // Update display
        updateScoreDisplay(currentProject);
    }

    function getProjectData(project) {
        const stored = localStorage.getItem(`gtm-${project}`);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            votes: 0,
            totalScore: 0,
            averageScore: 0
        };
    }

    function hasVoted(project) {
        return localStorage.getItem(`gtm-voted-${project}`) === 'true';
    }

    function showThankYou() {
        document.getElementById(`step-${currentStep}`).style.display = 'none';
        document.getElementById('step-thankyou').style.display = 'block';
        progressBar.style.width = '100%';

        // Close modal after 2 seconds
        setTimeout(() => {
            closeModal();
        }, 2000);
    }

    function updateScoreDisplay(project) {
        const data = getProjectData(project);
        const scoreElement = document.getElementById(`score-${project}`);

        if (data.votes === 0) {
            scoreElement.innerHTML = '<p class="score-text">No votes yet</p>';
        } else {
            scoreElement.innerHTML = `
                <p class="score-label">Go to Market Score</p>
                <p class="score-value">${data.averageScore}%</p>
                <p class="score-votes">${data.votes} ${data.votes === 1 ? 'vote' : 'votes'}</p>
            `;
        }
    }

    function updateAllScores() {
        updateScoreDisplay('99tickets');
        updateScoreDisplay('nailapp');
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
