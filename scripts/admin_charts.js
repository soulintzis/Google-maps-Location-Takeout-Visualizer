getTypesOfActivity();

async function getAllUsersLocations() {
  const response = await fetch(
    "http://localhost:3000/api/locations" 
  );
  return await response.json();
}

async function getActivities() {
    let locations = await getAllUsersLocations();
    let activities = [];
    for (let item of locations) {
        if (item.activity.length !== 0) {
            activities.push(item.activity);
        } else {
            continue;
        }
    }       
    return activities;
}

 async function getTypesOfActivity(){
    let activities =  await getActivities();
	let typesOfActivities =[]
	activity = {
		type: String,
		counter: Number
    };
    console.log(activities);
	for(let item of activities){
		for(let act of item){
			for(let final_obj of act.activity){
				if (!(
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN" ||
					final_obj.type === 'EXITING_VEHICLE'
				) && final_obj.confidence >= 65) {
						if (typesOfActivities.filter(e => e.type === final_obj.type).length > 0) {
							index = typesOfActivities.findIndex(x => x.type === final_obj.type);
							typesOfActivities[index].counter += 1;
						} else {
							activity = {
								type: final_obj.type,
								counter: 1
							};
							typesOfActivities.push(activity);
						}
						break;
				}else {
					continue;
				}
			}			
		}
    }
    console.log(typesOfActivities);
	return typesOfActivities;
}




