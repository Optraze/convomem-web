export function HomeTemplate() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 56,
        background: '#f7f5ef',
        fontFamily: "'Inter', sans-serif",
        color: '#172037',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 45,
              height: 45,
              borderRadius: 10,
              background: '#141414',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 20,
                background: '#fafafa',
              }}
            />
          </div>
          <span style={{ fontSize: 29, fontWeight: 600, letterSpacing: -1 }}>
            ConvoMem
          </span>
        </div>
        <span style={{ fontSize: 14, color: '#5c6a81' }}>convomem.com</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 2,
            color: '#5c6a81',
          }}
        >
          CUSTOMER MEMORY + CONVERSATION INTELLIGENCE
        </span>
        <span
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: -4,
            marginTop: 12,
          }}
        >
          Customer intelligence.
        </span>
        <span
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: -4,
            color: '#294bff',
          }}
        >
          With a memory.
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #d9dfec',
          paddingTop: 24,
        }}
      >
        <span style={{ fontSize: 17, color: '#617088' }}>
          Voice · Chat · SMS · Email
        </span>
        <span style={{ fontSize: 16, color: '#294bff', fontWeight: 600 }}>
          Context for your agents. Insight for your team.
        </span>
      </div>
    </div>
  )
}
