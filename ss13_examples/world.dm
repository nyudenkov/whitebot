// Тут вам будет приведён код world/Topic'a на Вайте с некоторыми комментариями.

/world/Topic(T, addr, master, key)

	var/list/input = params2list(T) // Переделываем принимаемые параметры в список.

	var/key_valid = (global.comms_allowed && input["key"] == global.comms_key) // Правильный ключ.

	if ("ping" in input)
		var/x = 1
		for (var/client/C)
			x++
		return x

/* Итак, разберём `if ("ping" in input)`. Метод раписан в models\Discord\Commands\DiscordCommandPing.js
> byondConnector.request("?ping", (results) => {
Тут мы отсылаем ?ping серверу. Это находится в T. Мы переделываем в список. Проверяем, есть ли ping в нём. (А он есть!)
И проходясь по каждому клиенту, возвращаем их количество (переменная x).
message.reply("Там **" + results.data + "** игроков онлайн, присоединяйся к ним написав **\"" + config.server_join_address + "\"** в адресной строке браузера");
После это находитсяв results.data и отсылается в Дискорд.
Такие дела.
С другим попробуй разобраться сам.
*/

	else if("players" in input)
		var/n = 0
		for(var/mob/M in player_list)
			if(M.client)
				n++
		return n

	else if ("status" in input)
		var/list/s = list()
		s["version"] = game_version
		s["mode"] = master_mode
		s["respawn"] = config.respawn
		s["enter"] = enter_allowed
		s["vote"] = config.allow_vote_mode
		s["host"] = host ? host : null
		s["active_players"] = get_active_player_count()
		s["players"] = clients.len

		var/adm = get_admin_counts()
		s["admins"] = adm //equivalent to the info gotten from adminwho
		s["gamestate"] = 1
		if(ticker)
			s["gamestate"] = ticker.current_state
		s["map_name"] = map_name ? map_name : "Unknown"
		if(key_valid && ticker && ticker.mode)
			s["real_mode"] = ticker.mode.name
		s["security_level"] = get_security_level()
		s["round_duration"] = round(world.time/10)

		if(SSshuttle && SSshuttle.emergency)
			s["shuttle_mode"] = SSshuttle.emergency.mode
			// Shuttle status, see /__DEFINES/stat.dm
			s["shuttle_timer"] = SSshuttle.emergency.timeLeft()
			// Shuttle timer, in seconds

		return list2params(s)

	else if("adminwho" in input)
		var/msg = "Current Admins:\n"
		for(var/client/C in admins)
			if(!C.holder.fakekey)
				msg += "\t[C] is a [C.holder.rank]"
				msg += "\n"
		return msg

	else if("who" in input)
		var/n = 0
		var/msg = "Current Players:\n"
		for(var/client/C)
			n++
			msg += "\t [C]\n"
		msg += "Total Players: [n]"
		return msg

	else if ("asay" in input)
		//var/input[] = params2list(T)
		if(global.comms_allowed)
			if(input["key"] != global.comms_key)
				return "Bad Key"
			else
				var/msg = "<span class='adminobserver'><span class='prefix'>DISCORD ADMIN:</span> <EM>[sanitize_russian(input["admin"])]</EM>: <span class='message'>[sanitize_russian(input["asay"])]</span></span>"
				admins << msg

	else if ("ooc" in input)
		//var/input[] = params2list(T)
		if(global.comms_allowed)
			if(input["key"] != global.comms_key)
				return "Bad Key"
			else
				for(var/client/C in clients)
					//if(C.prefs.chat_toggles & C.CHAT_OOC) // Discord OOC should bypass preferences.
					C << "<font color='[normal_ooc_colour]'><span class='ooc'><span class='prefix'>DISCORD OOC:</span> <EM>[sanitize_russian(input["admin"])]:</EM> <span class='message'>[sanitize_russian(input["ooc"])]</span></span></font>"

/*	else if("adminhelp" in input)
		var/msg = sanitize_russian(input["text"])
		var/author_admin = sanitize_russian(input["admin"])
		var/pos = findtext(msg, ":")
		if(input["key"] != global.comms_key)
			return "Bad Key"
		else
			if(pos)
				directory[ckey(copytext(msg,1,pos))] << "<span class='adminnotice'>PM from-<b>Discord Administrator [author_admin]</b>: [sanitize_russian(copytext(msg,pos,0))]</span>"
			else
				return "Can't find : symbol."*/

	else if("adminhelp" in input) //ebalsya ves' den, zaebalsya
		if(global.comms_allowed)
			if(input["key"] != global.comms_key)
				return "Bad Key"
			else
				for(var/client/M)
					if(M.ckey == ckey(input["ckey"]))
						M << 'sound/effects/adminhelp.ogg'
						M << "<span class='adminnotice'>PM from-<b>Discord Administrator [sanitize_russian(input["admin"])]</b>: [sanitize_russian(input["response"])]</span>"
						webhook_send_ahelp("[sanitize_russian(input["admin"])] -> [ckey(input["ckey"])]", sanitize_russian(input["response"]))
						for(var/client/A)
							if(A.holder)
								A << "Discord Administrator [sanitize_russian(input["admin"])] to [M.ckey]: [sanitize_russian(input["response"])]"
						return "Sent!"

	else if(T == "manifest")
		var/list/positions = list()
		var/list/set_names = list(
				"heads" = command_positions,
				"sec" = security_positions,
				"eng" = engineering_positions,
				"med" = medical_positions,
				"sci" = science_positions,
				"civ" = civilian_positions,
				"bot" = nonhuman_positions
			)

		for(var/datum/data/record/t in data_core.general)
			var/name = t.fields["name"]
			var/rank = t.fields["rank"]
			var/real_rank = t.fields["real_rank"]

			var/department = 0
			for(var/k in set_names)
				if(real_rank in set_names[k])
					if(!positions[k])
						positions[k] = list()
					positions[k][name] = rank
					department = 1
			if(!department)
				if(!positions["misc"])
					positions["misc"] = list()
				positions["misc"][name] = rank

		for(var/k in positions)
			positions[k] = list2params(positions[k]) // converts positions["heads"] = list("Bob"="Captain", "Bill"="CMO") into positions["heads"] = "Bob=Captain&Bill=CMO"
		return list2params(positions)

	else if("info" in input)
		//var/input[] = params2list(T)
		if(input["key"] != global.comms_key)
			if(world_topic_spam_protect_ip == addr && abs(world_topic_spam_protect_time - world.time) < 50)
				diary << "TOPIC: \"[T]\", from:[addr], master:[master], key:[key]"
				spawn(50)
					world_topic_spam_protect_time = world.time
					return "Bad Key (Throttled)"

			world_topic_spam_protect_time = world.time
			world_topic_spam_protect_ip = addr

			return "Bad Key"

		var/search = input["info"]
		var/ckey = ckey(search)
		var/list/match = list()

		for(var/mob/M in mob_list)
			if(findtext(M.name, search))
				match += M
			else if(M.ckey == ckey)
				match += M
			else if(M.mind && findtext(M.mind.assigned_role, search))
				match += M

		if(!match.len)
			return "No matches"
		else if(match.len == 1)
			var/mob/M = match[1]
			var/info = list()
			info["key"] = M.key
			info["name"] = M.name == M.real_name ? M.name : "[M.name] ([M.real_name])"
			info["role"] = M.mind ? (M.mind.assigned_role ? M.mind.assigned_role : "No role") : "No mind"
			var/turf/MT = get_turf(M)
			info["loc"] = M.loc ? "[M.loc]" : "null"
			info["turf"] = MT ? "[MT] @ [MT.x], [MT.y], [MT.z]" : "null"
			info["area"] = MT ? "[MT.loc]" : "null"
			info["antag"] = M.mind ? (M.mind.special_role ? M.mind.special_role : "Not antag") : "No mind"
			info["stat"] = M.stat
			info["type"] = M.type
			if(isliving(M))
				var/mob/living/L = M
				info["damage"] = list2params(list(
							oxy = L.getOxyLoss(),
							tox = L.getToxLoss(),
							fire = L.getFireLoss(),
							brute = L.getBruteLoss(),
							clone = L.getCloneLoss(),
							brain = L.getBrainLoss()
						))
			else
				info["damage"] = "non-living"
			info["gender"] = M.gender
			return list2params(info)
		else
			var/list/ret = list()
			for(var/mob/M in match)
				ret[M.key] = M.name
			return list2params(ret)


	else if(copytext(T,1,9)=="announce")
		var/i[]=params2list(T)
		if(i["key"] != global.comms_key)
			if(world_topic_spam_protect_ip == addr && abs(world_topic_spam_protect_time - world.time) < 50)
				spawn(50)
					world_topic_spam_protect_time = world.time
					diary << "TOPIC: \"[T]\", from:[addr], master:[master], key:[key]"
					return "Bad Key (Throttled)"

		i["announce"] = sanitize_russian(i["announce"])
		i["g"] = sanitize_russian(i["g"])
		for(var/client/C in clients)
			C<<"<font color=#[i["i"]]><b><span class='prefix'>OOC:</span> <EM>[i["g"]]:</EM> <span class='message'>[i["announce"]]</span></b></font>"


	else if("OOC" in input)
		//var/input[]=params2list(T)
		if(input["key"] != global.comms_key)
			if(world_topic_spam_protect_ip == addr && abs(world_topic_spam_protect_time - world.time) < 50)
				spawn(50)
					world_topic_spam_protect_time = world.time
					diary << "TOPIC: \"[T]\", from:[addr], master:[master], key:[key]"
					return "Bad Key (Throttled)"

		else
			return toggle_ooc()
