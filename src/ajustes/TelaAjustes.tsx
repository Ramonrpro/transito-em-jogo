import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useBanco, useRepositorio } from '../app/contexto.tsx'
import { useConfirmar } from '../app/Confirmar.tsx'
import Topo from '../app/Topo'
import { CONTEUDO_REVISADO_EM } from '../conteudo/index.ts'
import { CopiaInvalidaError, exportarCopia, importarCopia, nomeArquivoCopia } from '../dados/backup.ts'

const MSG_FORMATO = 'Este arquivo não é uma cópia válida do Trânsito em Jogo.'
const MSG_GENERICA = 'Não foi possível concluir. Tente de novo.'
const MSG_VERSAO_NOVA = 'Esta cópia foi feita numa versão mais nova do app. Atualize o app e tente de novo.'

export default function TelaAjustes() {
  const banco = useBanco()
  const repo = useRepositorio()
  const confirmar = useConfirmar()
  const [aviso, setAviso] = useState<{ texto: string; erro: boolean } | null>(null)

  async function salvarCopia() {
    try {
      await baixarCopia()
      setAviso(null)
    } catch {
      setAviso({ texto: MSG_GENERICA, erro: true })
    }
  }

  async function baixarCopia() {
    const agora = Date.now()
    const copia = await exportarCopia(banco, agora)
    const url = URL.createObjectURL(new Blob([JSON.stringify(copia)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivoCopia(agora)
    document.body.appendChild(a)
    a.click()
    a.remove()
    // Revogar na hora pode cancelar o download no Safari/iOS e em alguns Androids.
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  async function restaurar(e: ChangeEvent<HTMLInputElement>) {
    const entrada = e.target
    const arquivo = entrada.files?.[0]
    if (!arquivo) return
    setAviso(null)
    try {
      const ok = await confirmar({
        titulo: 'Restaurar esta cópia?',
        texto: 'O histórico atual deste celular será substituído.',
        confirmar: 'Restaurar',
      })
      if (ok) {
        let bruto: unknown
        try {
          bruto = JSON.parse(await arquivo.text())
        } catch {
          throw new CopiaInvalidaError('formato')
        }
        await importarCopia(banco, bruto)
        setAviso({ texto: 'Cópia restaurada.', erro: false })
      }
    } catch (erro) {
      const texto =
        erro instanceof CopiaInvalidaError
          ? erro.motivo === 'versao-nova'
            ? MSG_VERSAO_NOVA
            : MSG_FORMATO
          : MSG_GENERICA
      setAviso({ texto, erro: true })
    } finally {
      entrada.value = ''
    }
  }

  async function apagar() {
    const ok = await confirmar({
      titulo: 'Apagar todo o seu histórico deste celular?',
      texto: 'Isso não pode ser desfeito.',
      confirmar: 'Apagar',
    })
    if (!ok) return
    setAviso(null)
    try {
      await repo.apagarTudo()
      setAviso({ texto: 'Histórico apagado.', erro: false })
    } catch {
      setAviso({ texto: MSG_GENERICA, erro: true })
    }
  }

  return (
    <>
      <Topo titulo="Ajustes" />
      <section className="ajustes-secao">
        <h2 className="secao-titulo">Seus dados (ficam só neste celular)</h2>
        <button type="button" className="botao ajustes-item" onClick={() => void salvarCopia()}>
          💾 Salvar cópia do histórico
        </button>
        <label className="botao ajustes-item ajustes-arquivo">
          📂 Restaurar de uma cópia
          <input type="file" accept="application/json,.json" onChange={(e) => void restaurar(e)} />
        </label>
        <button type="button" className="botao ajustes-item ajustes-perigo" onClick={() => void apagar()}>
          🗑 Apagar meu histórico
        </button>
        {aviso && (
          <p role={aviso.erro ? 'alert' : 'status'} className={aviso.erro ? 'ajustes-erro' : 'ajustes-ok'}>
            {aviso.texto}
          </p>
        )}
      </section>
      <section className="ajustes-secao">
        <h2 className="secao-titulo">Sobre</h2>
        <p className="ajustes-linha">Conteúdo revisado em {CONTEUDO_REVISADO_EM}</p>
        <Link to="/ajustes/creditos" className="ajustes-linha ajustes-link">
          Fontes e créditos das imagens ›
        </Link>
        <p className="ajustes-linha">Versão {__APP_VERSION__}</p>
      </section>
    </>
  )
}
