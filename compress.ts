import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import commandLineArgs, { OptionDefinition } from 'command-line-args'
import commandLineUsage, {Section as UsageSection} from 'command-line-usage'
import fs from 'node:fs/promises'

async function compress(files: string[], destination: string, quality: number) {
  await imagemin(files, {
    destination,
    plugins: [
      imageminMozjpeg({
        quality,
      })
    ]
  })
}

const optionDefinitions: OptionDefinition[] = [
  { name: 'quality', alias: 'q', type: Number },
  { name: 'outDir', alias: 'o', type: String },
  { name: 'input', alias: 'i', type: String, multiple: true, defaultOption: true, },
  { name: 'help'}
]

const usage: UsageSection[] = [
  {
    header: 'Image Compression Tool',
    content: 'Compress images. Currently only supports jpeg input and MozJPEG output.'
  },
  {
    header: 'Usage',
    content: 'compress-img [-q <quality>] -o <outDir> <inputFile>+'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'quality',
        alias: 'q',
        typeLabel: '{underline int}',
        description: 'Quality of output. 0-100',
        defaultValue: 50,
      },
      {
        name: 'outDir',
        alias: 'o',
        typeLabel: '{underline dir}',
        description: 'Output compressed files in this directory',
      },
      {
        name: 'input',
        alias: 'i',
        typeLabel: '{underline file}',
        description: 'Input image files. Can be specified multiple times. Supports glob such as "images/*.jpg".',
        multiple: true,
        defaultOption: true
      }
    ]
  }
]


function printUsage() {
  const usageString = commandLineUsage(usage)
  console.log(usageString)
}

async function run() {
  try {
    const options = commandLineArgs(optionDefinitions) as {[name: string]: any};
    const quality = options['quality'] as number;
    const outDir = options['outDir'] as string;
    const inputs = options['input'] as string[];
    console.log(quality, outDir, inputs)

    await fs.mkdir(outDir, {recursive: true});

    console.log("Compressing image...")
    await compress(inputs, outDir, quality);
    console.log("Completed compression");
  } catch (err) {
    console.error(`[${err.name}]: ${err.message}`)
    printUsage()
  }
}

run()