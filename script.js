const filesystem = {
    'home': {
        'changelogs': {
            'summary.txt': 'v0.2 30.01.2025 - Added more commands and improved the terminal experience. <br> v0.1 29.01.2025 - Initial release of the simulated terminal.',
            'v0.1.txt': 'v0.1 Changelog 29.01.2025 <br> - Initial release of the simulated terminal.',
            'v0.2.txt': 'v0.2 Changelog 30.01.2025 <br> - Added clear command and improved the terminal experience. <br> - Fixed bug where you could cd into files.',
        },
        'projects': {
            'SimulatedTerminal.txt': 'This is a simulated terminal project created by Frxctured. It is a simple terminal emulator that allows you to navigate through a virtual file system and execute basic commands. The project is written in HTML, CSS, and JavaScript. Feel free to explore the project and try out different commands!',
        },
        'about-me.txt': 'Hello! I am Frxctured (15M). I am a beginner developer, and I am passionate about learning new things. I am currently learning web development and I am excited to share my journey with you! I love experimenting with new things, like new languages, frameworks, and libraries. I am also a huge fan of open-source software and I am excited to contribute to the community!',
        'contact.txt': 'Email: business@frxctured.com <br> GitHub: github.com/Frxctured <br> Discord: @_.frxctured',
        'about-project.txt': 'Check out this Project on GitHub: github.com/Frxctured/simulated-terminal'
    }
};

let currentPath = ['home'];

const terminal = document.getElementById('terminal');
const system = document.getElementById('system');
const output = document.getElementById('output');
const input_line = document.getElementById('input-line');
const input = document.getElementById('command-input');
const host = document.getElementById('host');

// BOOT ANIMATION 

window.addEventListener('load', function () {
    output.style.display = 'none';
    input_line.style.display = 'none';

    let dotCount = 0;
    const bootMessages = '[System v0.2] Booting up';
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
    

    printOutput('<p class="system">[System v0.2] Welcome to Frxctured\'s simulated Terminal! Type "help" to get started.</p>');
    if (isMobileDevice) {
        printOutput('<p class="system">[System v0.2] Detected a mobile device.</p><p class="error">DISCLAIMER: This site was not fully meant to be operational on mobile devices. You might experience unintended behaviour.</p>');
    }
});

//BOOT ANIMATION END

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
                // Loop through each entry in the directory
                const outputText = Object.keys(currentDir).map(item => {
                    // Check if it's a directory (object)
                    if (typeof currentDir[item] === 'object') {
                        return `<span class="directory">${item}</span>`; // Add directory style
                    } else {
                        return item; // Normal file, no special styling
                    }
                }).join(' ');

                printOutput(outputText);
            } else {
                printOutput('<p class="error">Error: Cannot list contents.</p>');
            }
            break;

        case 'cd':
            if (args[1]) {
                if (args[1] === '..') {
                    // Check if we're already at the home directory (['home'])
                    if (currentPath.length > 1) {
                        currentPath.pop();
                        const displayPath = currentPath.filter(dir => dir !== 'home').join('/') || '~';
                        if (currentPath.length > 1) {
                            host.innerHTML = `guest@frxctured:~/${displayPath}$`;
                        } else {
                            host.innerHTML = `guest@frxctured:~$`;
                        }
                    }
                } else {
                    const newPath = [...currentPath, args[1]];
                    const resolvedPath = resolvePath(newPath);

                    if (resolvedPath && typeof resolvedPath === 'object') { // Ensure it's a directory
                        currentPath = newPath; // Navigate into the directory
                        const displayPath = currentPath.filter(dir => dir !== 'home').join('/') || '~';
                        host.innerHTML = `guest@frxctured:~/${displayPath}$`;
                    } else if (resolvedPath && typeof resolvedPath === 'string') {
                        printOutput(`<p class="error">Error: "${args[1]}" is a file, not a directory.</p>`);
                    } else {
                        printOutput(`<p class="error">Error: No such directory: "${args[1]}"</p>`);
                    }
                }
            }
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

        case 'clear':
        case 'cls':
            output.innerHTML = '';
            break;

        case 'help':
            printOutput(`
                <pre>
Available commands:<br>
ls              lists files/directories in current directory.
cd &ltdir&gt        changes to the specified directory (e.g "cd projects").
cat &ltfile&gt      prints out a files contents (e.g "cat about-me.txt").
clear/cls       clears the terminal.
help            prints this help message.
</pre>`);
            break;

        case '':
            break;

        default:
            printOutput(`<p class="error">Error: Command not found "${cmd}"</p>`);
    }
}

function isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
}

const isMobileDevice = isTouchDevice(); // Detect device type

if (isMobileDevice) {
    input.attributes.removeAttribute('disabled');
} else {
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const command = input.value;
            printOutput(`<span class="prompt">${host.innerHTML}</span>${command}`);
            handleCommand(command);
            input.value = '';
        }
        if (event.key === 'Backspace') {
            event.preventDefault();
            input.value = input.value.slice(0, -1);
        } else if (event.key.length === 1) {
            input.value += event.key;
        }
    });
}
