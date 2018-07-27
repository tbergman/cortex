/**
 * Middleware for image resizing using http://sharp.pixelplumbing.com/en/stable/
 */
import sharp from 'sharp'
import request from 'superagent'

export default (req, res) => {
  request
    .get(req.query.url)
    .pipe(
      sharp().resize(
        Number(req.query.width) || null,
        Number(req.query.height) || null
      )
    )
    .pipe(res)
}
