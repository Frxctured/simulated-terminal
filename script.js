const filesystem = {
    'home': {
        'about-me.txt': 'Hello! I am Frxctured (15M). I am a beginner developer, and I am passionate about learning new things. I am currently learning web development and I am excited to share my journey with you! I also enjoy playing video games and want to make my own one day. I love experimenting with new things, like new languages, frameworks, and libraries. I am also a huge fan of open-source software and I am excited to contribute to the community!',
        'projects': {
            'LoremIpsum.txt': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            'githubRepo.txt': 'Check out this Project on GitHub: github.com/Frxctured/simulated-terminal',
        },
        'contact.txt': 'Email: business@frxctured.com <br> GitHub: github.com/Frxctured <br> Discord: @_.frxctured'
    }
};

let currentPath = ['home'];

const terminal = document.getElementById('terminal');
const system = document.getElementById('system');
const output = document.getElementById('output');
const input_line = document.getElementById('input-line');
const input = document.getElementById('command-input');
const host = document.getElementById('host');

window.addEventListener('load', function () {
    output.style.display = 'none';
    input_line.style.display = 'none';

    let dotCount = 0;
    const bootMessages = '[System v0.1] Booting up';
    const maxDots = 3;
    let intervalId;

    function animateBoot() {
        system.innerHTML = `${bootMessages}${'.'.repeat(dotCount)}`;
        dotCount++;
        if (dotCount > maxDots) {
            dotCount = 0; // Reset to 0 to start the cycle over
        }
    }

    // Start animation after 1 second
    setTimeout(() => {
        intervalId = setInterval(animateBoot, 500); // Animation runs every 500ms

        // Stop animation after 3 seconds
        setTimeout(() => {
            clearInterval(intervalId); // Stop the interval
            system.style.display = 'none'; // Hide the boot
        }, 6500); // 3 seconds after starting the animation
    }, 1000); // Start after 1 second
    setTimeout(() => {
        input_line.style.display = 'flex';
        output.style.display = 'block';
    }, 8500);
    

    printOutput('<p class="system">[System v0.1] Welcome to Frxctured\'s simulated Terminal! Type "help" to get started.</p>');
})

function printOutput(text) {
    output.innerHTML += `<div>${text}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}

function resolvePath(pathArray) {
    let location = filesystem;
    for (const dir of pathArray) {
        if (location[dir]) {
            location = location[dir];
        } else {
            return null;
        }
    }
    return location;
}

function handleCommand(command) {
    const args = command.trim().split(' ');
    const cmd = args[0];

    switch (cmd) {
        case 'ls':
            const currentDir = resolvePath(currentPath);
            if (currentDir && typeof currentDir === 'object') {
                printOutput(Object.keys(currentDir).join(' '));
            } else {
                printOutput('<p class="error">Error: Cannot list contents.</p>');
            }
            break;

        case 'cd':
            if (args[1]) {
                if (args[1] === '..') {
                    if (currentPath.length > 1) {
                        currentPath.pop();
                        const displayPath = currentPath.filter(dir => dir !== 'home').join('/') || '~';
                        host.innerHTML = `guest@frxctured:${displayPath}$`;
                    }
                } else {
                    const newPath = [...currentPath, args[1]];
                    if (resolvePath(newPath)) {
                        currentPath = newPath;
                        const displayPath = currentPath.filter(dir => dir !== 'home').join('/') || '~';
                        host.innerHTML = `guest@frxctured:~/${displayPath}$`;
                    } else {
                        printOutput(`<p class="error">Error: No such directory: "${args[1]}"</p>`);
                    }
                }
            }
            console.log(currentPath);
            break;

        case 'cat':
            if (args[1]) {
                const currentDir = resolvePath(currentPath);
                if (currentDir && currentDir[args[1]]) {
                    printOutput(currentDir[args[1]]);
                } else {
                    printOutput(`<p class="error">Error: No such file: "${args[1]}"</p>`);
                }
            }
            break;

        case 'help':
            printOutput('Available commands: ls, cd &ltdir&gt, cat &ltfile&gt, help');
            break;

        case '':
            break;

        default:
            printOutput(`<p class="error">Error: Command not found "${cmd}"</p>`);
    }
}

input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const command = input.value;
        printOutput(`<span class="prompt">${host.innerHTML}</span>${command}`);
        handleCommand(command);
        input.value = '';
    }
});

document.addEventListener('keypress', function () { 
    input.focus(); 
});
