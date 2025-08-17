// -- Redis Lua Scripting Cheat Sheet

// -- ==== Basic Lua Syntax ==== --

// -- Variables
// local x = 10
// local str = "hello"

// -- Tables (Lua's main data structure)
// local t = { "apple", "banana", "cherry" }
// local dict = { name = "Alice", age = 30 }

// -- Functions
// local function add(a, b)
//   return a + b
// end

// -- If statement
// if x > 5 then
//   print("x is greater than 5")
// elseif x == 5 then
//   print("x is five")
// else
//   print("x is less than 5")
// end

// -- For loops
// for i = 1, 5 do
//   print(i)
// end

// for k, v in pairs(dict) do
//   print(k, v)
// end

// -- While loop
// local i = 0
// while i < 3 do
//   print(i)
//   i = i + 1
// end

// -- ==== Redis Lua Scripting ==== --

// -- Access keys and arguments
// -- KEYS - array of key names passed in redis.eval
// -- ARGV - array of arguments passed in redis.eval

// -- Call Redis commands
// local val = redis.call('GET', KEYS[1])
// redis.call('SET', KEYS[1], ARGV[1])

// -- Use pcall for protected calls (to catch errors)
// local status, result = pcall(redis.call, 'GET', KEYS[1])
// if status then
//   return result
// else
//   return nil
// end

// -- Return values to Redis
// return redis.call('INCR', KEYS[1])

// -- ==== Common Patterns ==== --

// -- Increment a key atomically and return new value
// local newVal = redis.call('INCR', KEYS[1])
// return newVal

// -- Set a key only if it does not exist
// local set = redis.call('SETNX', KEYS[1], ARGV[1])
// return set  -- 1 if set, 0 if exists

// -- Conditional update example
// if redis.call('EXISTS', KEYS[1]) == 1 then
//   redis.call('SET', KEYS[1], ARGV[1])
//   return 1
// else
//   return 0
// end

// -- Iterate over a hash and sum values
// local sum = 0
// local fields = redis.call('HKEYS', KEYS[1])
// for _, field in ipairs(fields) do
//   local val = tonumber(redis.call('HGET', KEYS[1], field))
//   if val then sum = sum + val end
// end
// return sum

// -- Error handling example
// if not ARGV[1] then
//   return redis.error_reply("Missing argument")
// end

// -- ==== Returning complex data ====

// -- Return multiple values as table
// return { redis.call('GET', KEYS[1]), redis.call('GET', KEYS[2]) }

// -- Return table for Redis to convert to array reply

// -- ==== Tips ====

// -- Use tonumber() to convert string to number before math ops
// -- Use tostring() if you want to concatenate numbers with strings
// -- Redis commands inside Lua scripts are atomic and block other clients
// -- Use redis.call for commands that must succeed, redis.pcall for safe calls

// -- ==== Running Lua scripts in Redis ====

// -- Example CLI:
// -- EVAL "return redis.call('GET', KEYS[1])" 1 mykey

// -- In Node.js redis client:
// -- client.eval("return redis.call('GET', KEYS[1])", { keys: ['mykey'] });

