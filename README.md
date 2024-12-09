# Advent of Code 2024

My solutions to the [AoC 2024](https://adventofcode.com/2024) challenges written in [Civet](https://civet.dev).

## Day 1: Historian Hysteria ⭐⭐

```ts
[left, right] := getLines(input).map toNumbers |> rotate |> .map .sort asc

log sum left.map (x, i) => abs x - right[i]
log sum left.map & * counter(right)[&]
```

## Day 2: Red-Nosed Reports ⭐⭐

```ts
reports := input |> getLines |> .map toNumbers

function isSafe (report: number[])
  isAsc := report.1 - report.0 > 0
  for every i of [0...report# - 1]
    (1 <= report[i + int isAsc] - report[i + int !isAsc] <= 3)
 
log len reports.filter isSafe
log len reports.filter (r) => r.some (_, i) => isSafe r.toSpliced i, 1
```

## Day 3: Mull It Over ⭐⭐

```ts
mul := multiply
calc := (s: string) => sum s.match(/mul\(\d+,\d+\)/g)!map eval .

log calc input
log sum input.match(/(^|do\(\))[\s\S]*?($|don't\(\))/g)!map calc
```

## Day 4: Ceres Search ⭐⭐

```ts
puzzle := getArray2d input
dirs := flatten for x of [-1..1]
  for y of [-1..1]
    for l of [1..3]
      [x * l, y * l]

log sumLoop2d puzzle, (y, x, char) =>
  return 0 unless char is 'X'
  sum dirs.map (dir) =>
    dir.map([dx, dy] => puzzle[y + dy]?[x + dx]).join('') is 'MAS'

log sumLoop2d puzzle, (y, x, char) =>
  return 0 unless char is 'A'
  puzzle[y - 1]?[x - 1] + puzzle[y + 1]?[x + 1] is in ['MS', 'SM'] and
  puzzle[y - 1]?[x + 1] + puzzle[y + 1]?[x - 1] is in ['MS', 'SM']
```

## Day 5: Print Queue ⭐⭐

```ts
[rules, updates] := input.split('\n\n').map(getLines).map .map toNumbers

sumMiddles := (arr: number[][]) => sum arr.map &[&.#/2 | 0]
isCorrect := (update: number[]) => for every i of [0...update.#-1]
  rules.some matches update[i..i+1]

log sumMiddles updates.filter isCorrect
log sumMiddles updates.filter(negate isCorrect).map .sort (a, b) =>
  -rules.some matches [b, a]
```

## Day 6: Guard Gallivant ⭐⭐

```ts
board := getArray2d input
start := findInArray2d board, '^' |> as Point

simulate := (board: string[][], { x, y }: Point, dir = 0) =>
  visited := new Set [`${y}.${x}`]
  positions := new Set [`${y}.${x}.${dir}`]

  loop
    board[y - 1]?[x] is '#' ? dir = 1 : y-- if dir is 0
    board[y]?[x + 1] is '#' ? dir = 2 : x++ if dir is 1
    board[y + 1]?[x] is '#' ? dir = 3 : y++ if dir is 2
    board[y]?[x - 1] is '#' ? dir = 0 : x-- if dir is 3

    break with { visited, -loop } unless board[y]?[x]
    break with { visited, +loop } if positions.has `${y}.${x}.${dir}`

    visited.add `${y}.${x}`
    positions.add `${y}.${x}.${dir}`

{ visited } := simulate board, start

log visited.size
log for sum pos of visited
  tmp := set cloneDeep(board), pos, '#'
  simulate tmp, start |> .loop |> int
```

## Day 7: Bridge Repair ⭐⭐

```ts
lines := getLines(input).map(toNumbers).map [&.0, &[1..]] as const

calc := (operators: string) => sum lines.map [test, values] =>
  test if for some perm of getPerms [...operators], values.#-1
    x .= values.0
    for op, i of perm
      x += values[i+1] if op is '+'
      x *= values[i+1] if op is '*'
      x = +`${x}${values[i+1]}` if op is '|'
    test is x

log calc '+*'
log calc '+*|'
```

## Day 8: Resonant Collinearity ⭐⭐

```ts
city := getArray2d input
isInCity := (p: Point) => 0 <= p.x < city# and 0 <= p.y < city#
pairs := uniq input.replace /\n|\./g, ''
  |> .map findAllInArray2d city, .
  |> .flatMap getPerms(., 2).filter &.0 is not &.1

log len uniq pairs.flatMap [p1, p2] =>
  p := subVector p1, subVector p2, p1
  if isInCity p then [`${p.x},${p.y}`] else []

log len uniq pairs.flatMap [p1, p2] =>
  points := [addVector p1, subVector p2, p1]
  loop
    p := addVector points.-1, subVector p2, p1
    if isInCity p then points.push p else break
  points.map `${&.x},${&.y}`
```

## Day 9: Disk Fragmenter ⭐⭐

```ts
disk := map input, int
id .= 0
files: [string, string][] := []
blocks .= for join d, i of disk
  if i % 2
    '.'.repeat d  
  else
    file := String.fromCodePoint(256 + id++).repeat d
    files.unshift [file, '.'.repeat file#]
    file

compactBlocks := (blocks: string) =>
  while '.' is in blocks 
    last := blocks.-1
    blocks = blocks[..-2]
    blocks = blocks.replace '.', last unless last is '.'
  blocks

compactFiles := (blocks: string) =>
  for [file, space] of files
    fileIndex := blocks.indexOf file
    spaceIndex := blocks.indexOf space
    if spaceIndex < fileIndex and spaceIndex > -1
      blocks = blocks[...spaceIndex] + file + blocks[spaceIndex + file#...fileIndex] + space + blocks[fileIndex + file#..]
  blocks

checksum := (blocks: string) => sum for block, i of blocks
  block is '.' or i * (block.codePointAt(0)! - 256)

log checksum compactBlocks blocks
log checksum compactFiles blocks
```
