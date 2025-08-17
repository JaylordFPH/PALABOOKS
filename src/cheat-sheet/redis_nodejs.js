// import { createClient } from 'redis';

// const client = createClient();
// await client.connect();

// // --- Key commands ---
// await client.del('key');           // DEL key — Delete a key
// await client.dump('key');          // DUMP key — Serialize a key's value
// await client.exists('key');        // EXISTS key — Check if a key exists
// await client.expire('key', 60);    // EXPIRE key seconds — Set TTL for a key (in seconds)
// await client.expireAt('key', 1629984000); // EXPIREAT key timestamp — Set TTL to expire at specific UNIX time (seconds)
// await client.keys('*');            // KEYS pattern — Get all keys matching a pattern (use cautiously)
// await client.persist('key');       // PERSIST key — Remove TTL, make key persistent
// await client.pexpire('key', 1500); // PEXPIRE key milliseconds — Set TTL in milliseconds
// await client.pexpireAt('key', 1629984000000); // PEXPIREAT key milliseconds-timestamp — Set TTL to expire at specific UNIX time (ms)
// await client.pttl('key');          // PTTL key — Get TTL in milliseconds
// await client.ttl('key');           // TTL key — Get TTL in seconds
// await client.type('key');          // TYPE key — Get data type of value stored at key

// // --- String commands ---
// await client.append('key', 'value');        // APPEND key value — Append string to existing value
// await client.bitcount('key');                // BITCOUNT key — Count set bits in a string
// await client.bitop('AND', 'dest', 'key1', 'key2'); // BITOP operation dest keys — Perform bitwise ops between strings
// await client.decr('key');                     // DECR key — Decrement integer value by 1
// await client.decrBy('key', 2);                // DECRBY key decrement — Decrement by specified number
// await client.get('key');                       // GET key — Get string value of a key
// await client.getBit('key', 7);                 // GETBIT key offset — Get bit at offset
// await client.getRange('key', 0, 5);            // GETRANGE key start end — Get substring of value
// await client.getSet('key', 'newvalue');        // GETSET key value — Set new value and return old
// await client.incr('key');                       // INCR key — Increment integer value by 1
// await client.incrBy('key', 5);                  // INCRBY key increment — Increment by specified number
// await client.incrByFloat('key', 1.5);           // INCRBYFLOAT key increment — Increment float value
// await client.mget(['key1', 'key2']);             // MGET keys — Get multiple string values
// await client.mset({ key1: 'val1', key2: 'val2' }); // MSET key value pairs — Set multiple strings
// await client.msetNX({ key1: 'val1', key2: 'val2' }); // MSETNX — Set multiple keys if none exist
// await client.set('key', 'value', { EX: 10 });  // SET key value — Set string with optional expiry (EX seconds)
// await client.setBit('key', 7, 1);              // SETBIT key offset value — Set bit at offset
// await client.setNX('key', 'value');            // SETNX key value — Set if key does not exist
// await client.setRange('key', 5, 'foo');        // SETRANGE key offset value — Overwrite part of string starting at offset
// await client.strLen('key');                     // STRLEN key — Get length of string

// // --- Hash commands ---
// await client.hdel('hash', 'field');          // HDEL hash field — Delete one or more hash fields
// await client.hexists('hash', 'field');       // HEXISTS hash field — Check if field exists in hash
// await client.hget('hash', 'field');          // HGET hash field — Get value of a hash field
// await client.hgetAll('hash');                 // HGETALL hash — Get all fields and values of a hash
// await client.hincrBy('hash', 'field', 2);    // HINCRBY hash field increment — Increment hash field integer
// await client.hincrByFloat('hash', 'field', 1.5); // HINCRBYFLOAT hash field increment — Increment hash field float
// await client.hkeys('hash');                   // HKEYS hash — Get all fields in hash
// await client.hlen('hash');                    // HLEN hash — Get number of fields in hash
// await client.hmget('hash', ['field1', 'field2']); // HMGET hash fields — Get multiple hash fields
// await client.hmset('hash', { field1: 'val1', field2: 'val2' }); // HMSET hash field-value pairs — Set multiple hash fields
// await client.hset('hash', 'field', 'value'); // HSET hash field value — Set field in hash
// await client.hsetNX('hash', 'field', 'value'); // HSETNX hash field value — Set field only if it does not exist
// await client.hstrlen('hash', 'field');       // HSTRLEN hash field — Get length of hash field value
// await client.hvals('hash');                   // HVALS hash — Get all values in hash

// // --- List commands ---
// await client.blpop(['list1', 'list2'], 0);  // BLPOP keys timeout — Blocking pop first element from lists
// await client.brpop(['list1', 'list2'], 0);  // BRPOP keys timeout — Blocking pop last element from lists
// await client.brpopLPush('source', 'dest', 0); // BRPOPLPUSH source dest timeout — Blocking pop from source, push to dest
// await client.lindex('list', 0);               // LINDEX list index — Get element at index
// await client.linsert('list', 'BEFORE', 'pivot', 'value'); // LINSERT list BEFORE|AFTER pivot value — Insert element before or after pivot
// await client.llen('list');                     // LLEN list — Get list length
// await client.lpop('list');                     // LPOP list — Remove and get first element
// await client.lpush('list', 'value');           // LPUSH list value(s) — Insert elements at head
// await client.lpushX('list', 'value');          // LPUSHX list value — Insert at head only if list exists
// await client.lrange('list', 0, -1);            // LRANGE list start stop — Get elements in range
// await client.lrem('list', 0, 'value');         // LREM list count value — Remove elements equal to value
// await client.lset('list', 0, 'value');         // LSET list index value — Set element at index
// await client.ltrim('list', 0, 10);              // LTRIM list start stop — Trim list to specified range
// await client.rpop('list');                      // RPOP list — Remove and get last element
// await client.rpopLPush('source', 'dest');      // RPOPLPUSH source dest — Pop from source and push to dest
// await client.rpush('list', 'value');            // RPUSH list value(s) — Append elements at tail
// await client.rpushX('list', 'value');           // RPUSHX list value — Append at tail only if list exists

// // --- Set commands ---
// await client.sadd('set', 'member');             // SADD set member(s) — Add members to set
// await client.scard('set');                       // SCARD set — Get set cardinality (count)
// await client.sdiff(['set1', 'set2']);           // SDIFF sets — Difference between sets
// await client.sdiffStore('dest', ['set1', 'set2']); // SDIFFSTORE dest sets — Store set difference
// await client.sinter(['set1', 'set2']);          // SINTER sets — Intersection of sets
// await client.sinterStore('dest', ['set1', 'set2']); // SINTERSTORE dest sets — Store set intersection
// await client.sismember('set', 'member');        // SISMEMBER set member — Check membership
// await client.smembers('set');                    // SMEMBERS set — Get all members
// await client.smove('source', 'dest', 'member'); // SMOVE source dest member — Move member from source to dest
// await client.spop('set');                        // SPOP set [count] — Remove and return random member(s)
// await client.srandmember('set', 2);             // SRANDMEMBER set [count] — Get random member(s) without removal
// await client.srem('set', 'member');              // SREM set member(s) — Remove members from set
// await client.sunion(['set1', 'set2']);          // SUNION sets — Union of sets
// await client.sunionStore('dest', ['set1', 'set2']); // SUNIONSTORE dest sets — Store set union

// // --- Sorted Set commands ---
// await client.zadd('zset', { score: 1, value: 'one' });  // ZADD zset score member(s) — Add member with score
// await client.zcard('zset');                             // ZCARD zset — Count members in sorted set
// await client.zcount('zset', 0, 10);                     // ZCOUNT zset min   
// await client.zincrBy('zset', 2, 'member');              // ZINCRBY zset increment member — Increment member's score
// await client.zrange('zset', 0, -1);                     // ZRANGE zset start stop — Get members in range by rank
// await client.zrangeWithScores('zset', 0, -1);           // (helper) Get members with scores in range
// await client.zrangeByScore('zset', 0, 10);              // ZRANGEBYSCORE zset min max — Get members in score range
// await client.zrank('zset', 'member');                    // ZRANK zset member — Get rank of member
// await client.zrem('zset', 'member');                     // ZREM zset member(s) — Remove members
// await client.zremRangeByRank('zset', 0, 1);              // ZREMRANGEBYRANK zset start stop — Remove by rank range
// await client.zremRangeByScore('zset', 0, 1);             // ZREMRANGEBYSCORE zset min max — Remove by score range
// await client.zrevrange('zset', 0, -1);                   // ZREVRANGE zset start stop — Reverse range by rank
// await client.zrevrank('zset', 'member');                 // ZREVRANK zset member — Reverse rank
// await client.zscore('zset', 'member');                   // ZSCORE zset member — Get score of member

// // --- HyperLogLog commands ---
// await client.pfadd('hll', 'element');                    // PFADD key element(s) — Add elements to HyperLogLog
// await client.pfcount('hll');                              // PFCOUNT key(s) — Get approximate cardinality
// await client.pfmerge('dest', ['hll1', 'hll2']);           // PFMERGE dest HyperLogLogs — Merge HyperLogLogs

// // --- Geo commands ---
// await client.geoadd('geo', { longitude: 13.361389, latitude: 38.115556, member: 'Palermo' }); // GEOADD key longitude latitude member(s) — Add geo locations
// await client.geodist('geo', 'Palermo', 'Catania', 'km');   // GEODIST key member1 member2 [unit] — Get distance between locations
// await client.geohash('geo', 'Palermo');                     // GEOHASH key member(s) — Get geohash strings
// await client.geopos('geo', 'Palermo', 'Catania');           // GEOPOS key member(s) — Get positions
// await client.georadius('geo', 15, 37, 200, 'km');           // GEORADIUS key longitude latitude radius unit — Get members in radius
// await client.georadiusStore('geo', 15, 37, 200, 'km', { store: 'dest' }); // GEORADIUSSTORE — Store geo radius result in set

// // --- Pub/Sub commands ---
// await client.publish('channel', 'message');                // PUBLISH channel message — Publish message to channel
// await client.subscribe('channel', (message) => {           // SUBSCRIBE channel — Subscribe to channel with callback
//   console.log('Received:', message);
// });
// await client.unsubscribe('channel');                        // UNSUBSCRIBE channel — Unsubscribe from channel

// // --- Transaction commands ---
// const multi = client.multi();                               // MULTI — Start a transaction
// multi.set('key', 'value');                                  // Queue SET command
// multi.get('key');                                           // Queue GET command
// const execResult = await multi.exec();                      // EXEC — Execute queued commands atomically 
// await client.discard();                                     // DISCARD — Discard queued commands
// await client.watch('key');                                  // WATCH key — Watch key for conditional execution
// await client.unwatch();                                     // UNWATCH — Unwatch all keys

// // --- Scripting commands ---
// await client.eval('return ARGV[1]', { arguments: ['hello'] });  // EVAL script — Execute Lua script
// await client.evalSha('sha1', { arguments: ['hello'] });         // EVALSHA sha1 — Execute cached Lua script by SHA1

// // --- Server commands ---
// await client.bgrewriteaof();                               // BGREWRITEAOF — Rewrite Append Only File asynchronously
// await client.bgsave();                                     // BGSAVE — Save DB snapshot asynchronously
// await client.clientKill('127.0.0.1:6379');                // CLIENT KILL addr — Kill client by address
// await client.clientList();                                 // CLIENT LIST — List connected clients
// await client.clientPause(1000);                            // CLIENT PAUSE timeout — Pause clients for specified ms
// await client.clientSetName('myclient');                    // CLIENT SETNAME name — Set client name
// await client.configGet('*');                               // CONFIG GET parameter — Get server config
// await client.configSet('maxmemory', '100mb');              // CONFIG SET parameter value — Set server config
// await client.dbSize();                                     // DBSIZE — Get number of keys in DB
// await client.flushAll();                                   // FLUSHALL — Remove all keys in all DBs
// await client.flushDb();                                    // FLUSHDB — Remove all keys in current DB
// await client.info();                                       // INFO — Get server info and stats
// await client.lastSave();                                   // LASTSAVE — Get last save time
// await client.save();                                       // SAVE — Save DB snapshot synchronously
// await client.shutdown();                                   // SHUTDOWN — Shutdown server
// await client.time();                                       // TIME — Get server time

// // --- Streams commands ---
// await client.xadd('mystream', '*', { field1: 'value1' });        // XADD key ID field value(s) — Add entry to stream
// await client.xlen('mystream');                                    // XLEN key — Get stream length
// await client.xrange('mystream', '-', '+');                       // XRANGE key start end — Read entries in range
// await client.xrevrange('mystream', '+', '-');                    // XREVRANGE key end start — Read entries in reverse range
// await client.xdel('mystream', '1526985058136-0');                // XDEL key ID(s) — Delete entries by ID
