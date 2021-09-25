#!/usr/bin/env node

import { main } from "./server";

main(process.argv.includes('--debug'))
