import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    // Validate input
    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    // Define file names and paths
    const fileName = `main.${language === 'cpp' ? 'cpp' : 'py'}`;
    const filePath = path.join(process.cwd(), 'temp', fileName);
    const dockerfileName = `Dockerfile-${language === 'cpp' ? 'cpp' : 'py'}`;

    // Write code to file
    await fs.writeFile(filePath, code);

    // Build and run Docker container
    const dockerCommand = `timeout 10s docker build -f ${dockerfileName} -t code-execution . && docker run --rm code-execution`;

    return new Promise((resolve) => {
      exec(dockerCommand, (error, stdout, stderr) => {
        console.log('Docker command executed');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        if (error) {
          console.error(`Error: ${error.message}`);
          resolve(NextResponse.json({ 
            error: error.message,
            stdout: stdout,
            stderr: stderr
          }, { status: 500 }));
          return;
        }

        resolve(NextResponse.json({ 
          output: stdout,
          stderr: stderr
        }));
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}