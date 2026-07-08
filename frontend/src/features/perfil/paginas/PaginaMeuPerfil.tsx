import { useEffect, useState } from 'react'

import { authService } from '../../../services/authService'
import type { UsuarioAutenticado } from '../../../types/auth'

export default function PaginaMeuPerfil() {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setCarregando(true)
        setErro(null)

        const usuarioAutenticado = await authService.me()
        setUsuario(usuarioAutenticado)
      } catch (error: unknown) {
        setErro(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar os dados do perfil.'
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarPerfil()
  }, [])

  if (carregando) {
    return (
      <main className="admin-main">
        <p>Carregando perfil...</p>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1>Meu Perfil</h1>
            <p>Não foi possível carregar seus dados.</p>
          </div>
        </div>

        <section className="admin-card">
          <p>{erro}</p>
        </section>
      </main>
    )
  }

  if (!usuario) {
    return (
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1>Meu Perfil</h1>
            <p>Usuário não encontrado.</p>
          </div>
        </div>
      </main>
    )
  }

  const perfilFormatado =
    usuario.perfil === 'DOCENTE'
      ? 'Docente'
      : usuario.perfil === 'DISCENTE'
        ? 'Discente'
        : 'Administrador'

  const statusFormatado = usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'

  return (
    <main className="admin-main">
      <div className="admin-page-header">
        <div>
          <h1>Meu Perfil</h1>
          <p>Consulte seus dados cadastrais no sistema.</p>
        </div>
      </div>

      <section className="admin-card">
        <h2>Dados do Usuário</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Nome</label>
            <input value={usuario.nome} disabled />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input value={usuario.email} disabled />
          </div>

          <div className="form-group">
            <label>Perfil</label>
            <input value={perfilFormatado} disabled />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input value={statusFormatado} disabled />
          </div>
        </div>
      </section>
    </main>
  )
}
