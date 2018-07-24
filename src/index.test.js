describe('index', () => {
  test('require runs without error', async () => {
    const mod = require('./')
    expect(mod).toMatchObject({
      createAccessKey: expect.any(Function),
      createApp: expect.any(Function),
      getApp: expect.any(Function),
      createDeployment: expect.any(Function),
      updateDeployment: expect.any(Function),
      getTokens: expect.any(Function),
      login: expect.any(Function),
      openBrowser: expect.any(Function),
      refreshToken: expect.any(Function),
      archiveService: expect.any(Function),
      publishService: expect.any(Function),
      listTenants: expect.any(Function)
    })
  })
})
