import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the clack prompts the selector depends on so we can drive the
// interactive branch without a real TTY.
const { selectMock, cancelMock, isCancelMock } = vi.hoisted(() => ({
  selectMock: vi.fn(),
  cancelMock: vi.fn(),
  isCancelMock: vi.fn(() => false),
}))

vi.mock('@clack/prompts', () => ({
  select: selectMock,
  cancel: cancelMock,
  isCancel: isCancelMock,
}))

const { pickTemplate, templateOptions } = await import('../src/template-selector.ts')

describe('template selector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isCancelMock.mockReturnValue(false)
  })

  it('offers Solidity (next) and both Substrate stacks (next-papi, next-dedot)', () => {
    const byValue = Object.fromEntries(templateOptions.map(o => [o.value, o.label]))
    expect(byValue.next).toBe('Solidity')
    expect(byValue['next-papi']).toBe('Substrate (PAPI)')
    expect(byValue['next-dedot']).toBe('Substrate (Dedot)')
  })

  it('returns the chosen template in interactive mode', async () => {
    selectMock.mockResolvedValue('next-papi')

    const result = await pickTemplate(undefined, true)

    expect(result).toBe('next-papi')
    expect(selectMock).toHaveBeenCalledTimes(1)
    const call = selectMock.mock.calls[0][0]
    expect(call.options).toBe(templateOptions)
    expect(call.message.toLowerCase()).toContain('stack')
  })

  it('falls back to the default template (next) when non-interactive', async () => {
    const result = await pickTemplate(undefined, false)

    expect(result).toBe('next')
    expect(selectMock).not.toHaveBeenCalled()
  })

  it('honors a valid provided template without prompting', async () => {
    expect(await pickTemplate('next-papi')).toBe('next-papi')
    expect(await pickTemplate('next-dedot')).toBe('next-dedot')
    expect(await pickTemplate('next')).toBe('next')
    expect(selectMock).not.toHaveBeenCalled()
  })
})
