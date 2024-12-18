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

## Day 10: Hoof It ⭐⭐

```ts
grid := getArray2d input |> .map .map int
heads := findAllInArray2d grid, 0

function move ({ x, y }: Point): string[]
  return [`${x},${y}`] if grid[y][x] is 9
  adjacentCross grid, x, y
    .filter &.value is grid[y][x] + 1
    .flatMap move .

log sum heads.map (head) => len uniq move head
log sum heads.map (head) => len      move head
```

## Day 11: Plutonian Pebbles ⭐⭐

```ts
stones .= toNumbers input

blink := memo (stone: number, blinks: number): number =>
  str := stone.toString()
  unless blinks-- then 1
  else if stone is 0 then blink 1, blinks 
  else if str# % 2 is 0 then blink(+str[...str#/2], blinks) + blink(+str[str#/2..], blinks)
  else blink stone * 2024, blinks

log sum map stones, blink ., 25
log sum map stones, blink ., 75
```

## Day 12: Garden Groups ⭐⭐

```ts
garden := getArray2d input
visited := new Set<string>
type Edge = [Point, Point]

findRegion := ({x, y}: Point, type: string, edges: Edge[] = []): [number, number, string, Edge[]] => 
  perimeter .= 0
  area .= 1
  key := `${x},${y}`
  if visited.has(key) return [0, 0, type, edges] else visited.add key
  for p of adjacentCross garden, x, y
    if p.value is type
      [nextArea, nextPerimeter] := findRegion p, type, edges
      area += nextArea
      perimeter += nextPerimeter
    else 
      edges.push [{x, y}, p]
      perimeter++
  [area, perimeter, type, edges]

calcSides := (edges: Edge[]) =>
  v := edges.filter &.0.x is &.1.x |> groupBy ., &.0.y + &.1.y * 2 |> values |> .map (a) => countAsc a.map &.0.x
  h := edges.filter &.0.y is &.1.y |> groupBy ., &.0.x + &.1.x * 2 |> values |> .map (a) => countAsc a.map &.0.y
  sum v ++ h

countAsc := (arr: number[]) =>
  sum for i of [0...arr.sort(asc)#]
    arr[i] + 1 is not arr[i + 1]

p1 .= 0
p2 .= 0
map2d garden, (x, y, value) =>
  [area, perimeter, _, edges ] := findRegion({x, y}, value)
  p1 += area * perimeter
  p2 += area * calcSides edges

log p1, p2
```

## Day 13: Claw Contraption ⭐⭐

```ts
machines := chunk toNumbers(input), 6
tokens := ([a, b, c, d, e, f]: number[]) =>
  (d*e-c*f) / (a*d-c*b) * 3 + (a*f-b*e) / (a*d-c*b) |> & % 1 ? 0 : &

log sum machines.map tokens
log sum machines.map(&[..3] ++ &[-2..].map &+1e13).map tokens
```

## Day 14: Restroom Redoubt ⭐⭐

```ts
start := chunk toNumbers(input), 4
getRobots := (t: number) => start.map [x0, y0, vx, vy] =>
  . (x0 + vx * t) %% 101
  . (y0 + vy * t) %% 103

quadrants:= [0, 0, 0, 0]
getRobots(100).forEach [x, y] =>
  quadrants.0++ if x < 50 and y < 51
  quadrants.1++ if x < 50 and y > 51
  quadrants.2++ if x > 50 and y < 51
  quadrants.3++ if x > 50 and y > 51

log product quadrants

for t of [0...10000]
  robots := getRobots t
  for y of [0...103]
    line := '.'.repeat(101).split ''
    robotsInLine := robots.filter(&.1 is y).map &.0
    for x of [0..101]
      line[x] = '#' if x is in robotsInLine 
    throw t if '###########' is in line.join ''
```

## Day 15: Warehouse Woes ⭐⭐

```ts
data := input.split '\n\n'
moves := data.1.replaceAll '\n', ''
grid1 := getArray2d data.0
grid2 := getLines(data.0).map (line) =>
  line.replaceAll('#','##').replaceAll('.','..').replaceAll('O','[]').replace('@', '@.').split ''

getNextPoint := (p: Point, move: string) =>
  switch move
    '>' then x: p.x + 1, y: p.y
    '<' then x: p.x - 1, y: p.y
    '^' then x: p.x, y: p.y - 1
    else x: p.x, y: p.y + 1

nextP1 := (p: Point, move: string) =>
  n := getNextPoint(p, move)
  return false if grid1[n.y]![n.x] is '#'
  if grid1[n.y]![n.x] is '.' or grid1[n.y]![n.x] is 'O' and nextP1 n, move
    grid1[n.y]![n.x] = grid1[p.y]![p.x]
    grid1[p.y]![p.x] = '.'
    return true

nextP2 := (p: Point, move: string) =>
  n := getNextPoint(p, move)
  return false if grid2[n.y]![n.x] is '#'
  
  if grid2[n.y]![n.x] is '.' or move is in '><' and nextP2 n, move
    grid2[n.y]![n.x] = grid2[p.y]![p.x]
    grid2[p.y]![p.x] = '.'
    return true

  return false if move is not in '^v' or not canMove(n, move)

  dy := move is 'v' ? 1 : -1
  if grid2[n.y]![n.x] is '[' and canMove({ x: n.x + 1, y: n.y }, move)
      nextP2 n, move
      nextP2 { y: n.y, x: n.x + 1}, move
      grid2[n.y]![n.x] = '@'
      grid2[n.y]![n.x + 1] = '.'
      grid2[n.y + dy]![n.x] = '['
      grid2[n.y + dy]![n.x + 1] = ']'
      grid2[p.y]![p.x] = '.'
      return true

  if grid2[n.y]![n.x] is ']' and canMove({ x: n.x - 1, y: n.y }, move)
      nextP2 n, move
      nextP2 { y: n.y, x: n.x - 1}, move
      grid2[n.y]![n.x] = '@'
      grid2[n.y]![n.x - 1] = '.'
      grid2[n.y + dy]![n.x] = ']'
      grid2[n.y + dy]![n.x - 1] = '['
      grid2[p.y]![p.x] = '.'
      return true

canMove := (p: Point, move: string) =>
  n := getNextPoint(p, move)
  return false if grid2[n.y]![n.x] is '#'
  return true if grid2[n.y]![n.x] is '.'
  return true if grid2[n.y]![n.x] is '[' and canMove(n, move) and canMove({ x: n.x + 1, y: n.y }, move)
  return true if grid2[n.y]![n.x] is ']' and canMove(n, move) and canMove({ x: n.x - 1, y: n.y }, move)
  
for move of moves
  nextP1 findInArray2d(grid1, '@')!, move
  nextP2 findInArray2d(grid2, '@')!, move

log for sum {x, y} of findAllInArray2d grid1, 'O'
  x + y * 100

log for sum {x, y} of findAllInArray2d grid2, '['
  x + y * 100
```

## Day 16: Reindeer Maze ⭐

```ts
Graph from graphology
{ dijkstra } from graphology-library/shortest-path

maze := getArray2d input
start := findInArray2d(maze, 'S')!
end := findInArray2d(maze, 'E')!
graph := new Graph

directions := 
  . dx: 1, dy: 0
  . dx: 0, dy: 1
  . dx: -1, dy: 0
  . dx: 0, dy: -1

map2d maze, (x, y, value) =>
  return if value is '#'
  graph.addNode `${x},${y},${d}` for d of [0..3]

map2d maze, (x, y, value) =>
  return if value is '#'
  for d of [0..3]
    current := `${x},${y},${d}`
    nx := x + directions[d].dx
    ny := y + directions[d].dy

    graph.addEdge current, `${nx},${ny},${d}`, weight: 1 if maze[ny]![nx] is not '#'
    graph.addEdge current, `${x},${y},${(d-1) %% 4}`, weight: 1000
    graph.addEdge current, `${x},${y},${(d+1) %% 4}`, weight: 1000

log min for i of [0..3]
  nodes := dijkstra.bidirectional(graph, `${start.x},${start.y},0`, `${end.x},${end.y},${i}`)!
  for sum i of [0...nodes# - 1]
    nodes[i].split(',').-1 is nodes[i + 1].split(',').-1 ? 1 : 1000
```
