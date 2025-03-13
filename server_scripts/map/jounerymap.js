/**
 * 美化一下 jounery map 的标点分享
 * @authors Gerard
 * @date    2025-03-12
 * @version 1.0.0
 * @minecraft 1.20.1
 * @modloader forge + fabric
 * @requirements No Chat Report
 */

PlayerEvents.decorateChat(event => {
  // [name:text, dim:#, x:#, z:#, y:#]
  // [name:text, x:#, z:#, y:#]
  // [x:#, z:#, y:#]
  // [dim:#, x:#, z:#, y:#]
  const regex = /^(\[).*?([xyz]:(-?\d*\.*\d*), ){2}[xyz]:(-?\d*\.*\d*).*?\]$/gim;
  //console.log(regex.test(event.message.trim()))
  if (regex.test(event.message.trim())) {
    let msg = '' + event.message

    let props = { name: '', dim: '', x: 0, y: 0, z: 0 }
    msg.substring(1, msg.length - 1).split(',').forEach(ele => {
      let str = ele.trim().split(':')
      props[str[0]] = str.splice(1).join(':')
    });
    props.dim = props.dim === '' ? event.player.block.dimension.toString() : props.dim;
    props.name = props.name === '' ? event.username + '分享的位置' : props.name;

    // /jm wpedit [name:text, dim:#, x:#, z:#, y:#]
    let add_command = `/jm wpedit [name:${props.name}, dim:${props.dim}, x:${props.x}, z:${props.z}, y:${props.y}]`
    let base = Component.string('')
    let texts = [
      Component.string('分享了一个位置：').noColor(),
      //dim_translate.green().underlined(),
      Component.green(`[x: ${props.x} y: ${props.y} z: ${props.z} @ ${props.dim.split(':')[1]}]`).underlined(),
    ]
    texts.forEach(ele => base.append(ele))
    base.clickRunCommand(add_command).hover('点击添加路径点')

    event.setMessage(base)
  }

})

