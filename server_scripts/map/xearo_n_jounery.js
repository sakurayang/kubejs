/**
 * 统一一下 xearos 和 jounery map 的标点分享
 * @authors Gerard
 * @date    2025-03-12
 * @version 1.0.0
 * @minecraft 1.20.1
 * @modloader forge + fabric
 * @requirements No Chat Report
 */

PlayerEvents.decorateChat(event => {
  const jounery_regex = /^(\[).*?([xyz]:(-?\d*\.*\d*), ){2}[xyz]:(-?\d*\.*\d*).*?\]$/gim;
  let msg = event.message.trim().toLowerCase()
  let jounery_test = jounery_regex.test(msg);
  if (jounery_test || msg.includes('xaero-waypoint')) {
    let props = { name: '', x: 0, y: 0, z: 0, dim: '', xearo_dim: '' };
    if (jounery_test) {
      for (const ele of msg.replace('[', '').replace(']', '').split(',')) {
        props[ele.trim().split(':')[0]] = ele.trim().split(':').slice(1).join(':')
      }
      props.dim = props.dim !== '' ? props.dim : event.player.block.dimension.toString();
      props.name = props.name !== '' ? props.name : event.username;
      props.xearo_dim = `Internal-dim%${props.dim.replace(':', '$')}-waypoints`;
    } else {
      let parse = msg.split(':')
      props.name = parse[1]
      props.x = parse[3]
      props.y = parse[4]
      props.z = parse[5]
      props.xearo_dim = parse[parse.length - 1].replace('internal','Internal')
      props.dim = (parse[parse.length - 1].includes('$')?'':'minecraft:') + parse[parse.length - 1].toLowerCase().replace('internal-', '').replace('-waypoints', '').replace('$', ':').replace('dim%', '')
      
    }
    console.printObject(props)

    let base = Component.string('')
    let texts = [
      Component.string('分享了一个位置：').noColor(),
      //dim_translate.green().underlined(),
      Component.green(`[x: ${props.x} y: ${props.y} z: ${props.z} @ ${props.dim.split(':')[1]}]`).underlined().hover('点击添加标点'),
      Component.red('[J]').hover('旅行者地图点这个\n注：由于旅行者地图的bug，跨维度添加标点要手动选择维度').clickRunCommand(`/jm wpedit [name:${props.name}, dim:${props.dim.replace('-', '_')}, x:${props.x}, z:${props.z}, y:${props.y}]`).underlined(false),
      Component.blue('[X]').hover('Xearo 的地图点这个').clickRunCommand(`/xaero_waypoint_add:${props.name}:${props.name.slice(0, 1).toUpperCase()}:${props.x}:${props.y}:${props.z}:4:false:0:${props.xearo_dim}`).underlined(false)
    ]
    texts.forEach(ele => base.append(ele))
    event.setMessage(base)
  }
})
