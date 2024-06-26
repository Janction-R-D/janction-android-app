// src/main/java/com/example/recyclerviewexample/TextAdapter.kt
package com.janctionmobile

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class TextAdapter : RecyclerView.Adapter<TextAdapter.TextViewHolder>() {
    private val textList = mutableListOf<String>()

    class TextViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textView: TextView = itemView as TextView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TextViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_text, parent, false)
        return TextViewHolder(view)
    }

    override fun onBindViewHolder(holder: TextViewHolder, position: Int) {
        holder.textView.text = textList[position]
    }

    override fun getItemCount() = textList.size

    fun addText(text: String) {
        textList.add(text)
        notifyItemInserted(textList.size - 1)
    }
}
