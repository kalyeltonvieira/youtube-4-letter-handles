# YouTube 4-Letter Handles

A tool for scanning **4-letter YouTube handles** and identifying handles that may be available.

## Overview

This project checks combinations of four letters and records their current status on YouTube.

It can be useful for:

* Finding short YouTube handles
* Researching handle availability
* Building lists of potentially available handles
* Monitoring short handle combinations

## How It Works

The scanner generates combinations of four letters:

```text
aaaa
aaab
aaac
...
zzzz
```

It then checks the corresponding YouTube handle URL and records the response.

> **Note:** A handle marked as potentially available by the scanner is not guaranteed to be available for registration. YouTube may apply additional restrictions or the status may change.

## Output

The scanner can save the results to a CSV file containing information such as:

* Handle
* HTTP status
* Redirect location
* Content type
* Availability/status information

Example:

```text
handle,status,location
abcd,...
qzvx,...
xkpt,...
```

## Requirements

* Python 3.9+
* `aiohttp`

Install the dependency:

```bash
pip install aiohttp
```

## Usage

Run the scanner with:

```bash
python scan_youtube_handles.py
```

The results are saved as a CSV file for further analysis.

## Disclaimer

This project is intended for research and informational purposes. Results should not be considered an official indication of YouTube handle availability.

Always verify a handle directly on YouTube before attempting to claim it.

## License

MIT License

Copyright (c) 2026 Kalyelton Vieira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

