class Api::MentionsController < ApplicationController
  # GET /api/mentions/all
  def index
    @mentions = ActiveMention.order(created_at: :desc)
    render json: {
      mentions: @mentions,
      total: @mentions.count
    }
  end

  # GET /api/mentions/active
  def active
    @active_mentions = ActiveMention.where(is_active: true).order(:position)
    render json: {
      active_mentions: @active_mentions,
      total: @active_mentions.count
    }
  end

  # POST /api/mentions
  def create
    @mention = ActiveMention.new(mention_params)

    if @mention.save
      render json: {
        message: 'Mención creada exitosamente',
        mention: @mention
      }, status: :created
    else
      render json: {
        error: 'Error al crear mención',
        errors: @mention.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PUT /api/mentions/:id
  def update
    @mention = ActiveMention.find(params[:id])
    if @mention.update(mention_params)
      render json: {
        message: 'Mención actualizada exitosamente',
        mention: @mention
      }
    else
      render json: {
        error: 'Error al actualizar mención',
        errors: @mention.errors.full_messages
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Mención no encontrada' }, status: :not_found
  end

  # DELETE /api/mentions/:id
  def destroy
    @mention = ActiveMention.find(params[:id])
    @mention.destroy
    render json: {
      message: 'Mención eliminada exitosamente'
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Mención no encontrada' }, status: :not_found
  end

  # PUT /api/mentions/active
  def update_active
    render json: { message: 'Prueba exitosa' }
  end

  # PUT /api/mentions/active-test
  def update_active_test
    Rails.logger.info "=== DEBUG: Método de prueba ejecutándose ==="
    Rails.logger.info "params: #{params.inspect}"
    
    render json: {
      message: 'Prueba exitosa',
      received_params: params.inspect
    }
  end

  # GET /api/mentions/test-simple
  def test_simple
    Rails.logger.info "=== DEBUG: Método test_simple ejecutándose ==="
    Rails.logger.info "params: #{params.inspect}"
    
    render json: {
      message: 'Test simple exitoso',
      received_params: params.inspect
    }
  end

  private

  def mention_params
    params.require(:mention).permit(:name, :description, :category, :priority, :is_active, :keywords)
  end
end 