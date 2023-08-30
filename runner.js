import  { exec } from 'child_process';

setInterval(() => {
    exec('node build/src/main.js', (error, stdout, stderr) => {
       
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}, 10000); // Запуск каждые 10 секунд
