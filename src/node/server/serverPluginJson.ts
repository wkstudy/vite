import { ServerPlugin } from '.'
import { readBody, isImportRequest } from '../utils'
import { dataToEsm } from '@rollup/pluginutils'

/**
 * wk json包装为一个esm
 * @param param0
 */
export const jsonPlugin: ServerPlugin = ({ app }) => {
  app.use(async (ctx, next) => {
    await next()
    // handle .json imports
    // note ctx.body could be null if upstream set status to 304
    if (ctx.path.endsWith('.json') && isImportRequest(ctx) && ctx.body) {
      ctx.type = 'js'
      ctx.body = dataToEsm(JSON.parse((await readBody(ctx.body))!), {
        namedExports: true,
        preferConst: true
      })
    }
  })
}
