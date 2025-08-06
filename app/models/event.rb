class Event < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :color, presence: true
  
  scope :active, -> { where(is_active: true) }
  scope :inactive, -> { where(is_active: false) }
  
  # Métodos para gestión de tags
  def add_tag(tag)
    self.tags ||= []
    self.tags << tag unless self.tags.include?(tag)
    save!
  end

  def remove_tag(tag)
    self.tags ||= []
    self.tags.delete(tag)
    save!
  end

  def tags
    # Si tags es nil, inicializar como array vacío
    self[:tags] ||= []
    # Si es string, parsear como JSON
    if self[:tags].is_a?(String)
      JSON.parse(self[:tags]) rescue []
    else
      self[:tags]
    end
  end

  def tags=(value)
    # Asegurar que siempre sea un array
    self[:tags] = value.is_a?(Array) ? value : []
  end
end 